const paypal = require("../../Utils/lib/paypal");
const OrderModel = require("../../Models/Common/OrderModel");
const LeadCoursePurchaseModel = require("../../Models/Lead/PurchaseCourses");
const db = require("../../Utils/DB/db");
const { isValidObjectId } = require("mongoose");
const LeadModel = require("../../Models/RBAC/LeadModel");
const courseModel = require("../../Models/Instructor/Courses");

const CreateOrder = async (req, res) => {
    await db()
    const {
        userId,
        userEmail,
        orderStatus,
        paymentMethod,
        orderDate,
        paymentId,
        payerId,
        instructorId,
        courseId,
        coursePrice,
        courseTitle
    } = req.body
    try {
        const formattedPrice = coursePrice.toFixed(2);
        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/lead/payment-return`,
                cancel_url: `${process.env.CLIENT_URL}/lead/payment-cancel`
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: courseTitle,
                                sku: courseId,
                                price: formattedPrice,
                                currency: "USD",
                                quantity: 1
                            }
                        ]
                    },
                    amount: {
                        currency: "USD",
                        total: formattedPrice
                    },
                    description: courseTitle
                }
            ]
        };


        paypal.payment.create(create_payment_json, async function (err, paymentInfo) {
            if (err) {
                console.log(err)
                return res.status(err.httpStatusCode).json({
                    success: false,
                    message: err
                })
            }
            else {
                const newlyCreatedCourseOrder = new OrderModel({
                    userId,
                    userEmail,
                    orderStatus,
                    paymentMethod,
                    orderDate,
                    paymentId,
                    payerId,
                    instructorId,
                    courseId,
                    coursePrice,
                    courseTitle
                })
                await newlyCreatedCourseOrder.save()
                const approvalUrl = paymentInfo.links.find((link) => link.rel === "approval_url").href
                res.send({
                    success: true,
                    orderId: Object(newlyCreatedCourseOrder._id),
                    approvalUrl
                })
            }
        })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
        console.log(err)
    }
}

const CapturePayment = async (req, res) => {
    await db()
    const { paymentId, payerId, orderId, leadId } = req.body;
    console.log("Starting payment capture with:", { paymentId, payerId, orderId, leadId });
    
    try {
        // Find lead
        const LeadProfileId = await LeadModel.findOne({ userId: leadId });
        if (!LeadProfileId) {
            console.error("Lead not found for userId:", leadId);
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        // Find order
        let order = await OrderModel.findById(String(orderId));
        if (!order) {
            console.error("Order not found for ID:", orderId);
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Execute PayPal payment
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [{
                amount: {
                    currency: "USD",
                    total: parseFloat(order.coursePrice.toString()).toFixed(2)
                }
            }]
        };

        console.log("Executing PayPal payment with:", execute_payment_json);

        // Verify and execute the payment with PayPal
        paypal.payment.execute(paymentId, execute_payment_json, async function(error, payment) {
            if (error) {
                console.error("PayPal execution error:", error);
                return res.status(500).json({
                    success: false,
                    message: error.message || "Payment execution failed"
                });
            }

            console.log("PayPal payment executed successfully:", payment);

            try {
                // Update order status
                order.orderStatus = "Approval";
                order.paymentId = paymentId;
                order.payerId = payerId;
                await order.save();
                
                console.log("Order updated successfully:", order);

                // Check if lead already has purchased courses
                let leadCourses = await LeadCoursePurchaseModel.findOne({
                    leadId: LeadProfileId._id
                });
                
                if (leadCourses) {
                    // Check if course already exists in lead's courses
                    const courseExists = leadCourses.course.some(
                        c => c.courseId.toString() === order.courseId.toString()
                    );

                    if (!courseExists) {
                        leadCourses.course.push({
                            courseId: order.courseId,
                            courseTitle: order.courseTitle,
                            instructorId: order.instructorId,
                            paid: order.coursePrice
                        });
                        await leadCourses.save();
                    }
                } else {
                    // Create new purchase record
                    leadCourses = new LeadCoursePurchaseModel({
                        leadId: LeadProfileId._id,
                        course: [{
                            courseId: order.courseId,
                            courseTitle: order.courseTitle,
                            instructorId: order.instructorId,
                            paid: order.coursePrice
                        }]
                    });
                    await leadCourses.save();
                }

                // Update course with new lead
                await courseModel.findByIdAndUpdate(order.courseId, {
                    $addToSet: {
                        leads: {
                            leadId: LeadProfileId._id,
                            paidAmount: order.coursePrice,
                        }
                    }
                });

                console.log("All database updates completed successfully");

                res.json({
                    success: true,
                    message: "Payment successful and course access granted"
                });
            } catch (saveError) {
                console.error("Database update error:", saveError);
                res.status(500).json({
                    success: false,
                    message: "Payment verified but failed to update records: " + saveError.message
                });
            }
        });
    } catch (err) {
        console.error("Payment capture error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Payment capture failed"
        });
    }
}

module.exports = { CreateOrder, CapturePayment }