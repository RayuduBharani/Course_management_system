const db = require("../../../Utils/DB/db");
const paypal = require("../../../Utils/lib/paypal");
const StudentModel = require('../../../Models/RBAC/StudentModel');
const OrderModel = require("../../../Models/Common/OrderModel");
const StudentCoursePurchaseModel = require("../../../Models/Student/PurchaseCourses");
const courseModel = require("../../../Models/Instructor/Courses");

const StudentCreateModel = async (req, res) => {
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
        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/student/payment-return`,
                cancel_url: `${process.env.CLIENT_URL}/student/payment-cancel`
            },
            transactions: [{
                item_list: {
                    items: [{
                        name: courseTitle,
                        sku: courseId,
                        price: coursePrice,
                        currency: "USD",
                        quantity: 1
                    }]
                },
                amount: {
                    currency: "USD",
                    total: coursePrice.toFixed(2)
                },
                description: courseTitle
            }]
        };

        paypal.payment.create(create_payment_json, async (err, paymentInfo) => {
            if (err) {
                console.error("PayPal payment creation error:", err);
                return res.status(err.httpStatusCode || 500).json({
                    success: false,
                    message: err.message || "Failed to create PayPal payment"
                });
            }
            
            try {
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
                });
                await newlyCreatedCourseOrder.save();
                const approvalUrl = paymentInfo.links.find((link) => link.rel === "approval_url").href;
                res.send({
                    success: true,
                    orderId: String(newlyCreatedCourseOrder._id),
                    approvalUrl
                });
            } catch (dbError) {
                console.error("Database error while creating order:", dbError);
                res.status(500).json({
                    success: false,
                    message: "Failed to save order details"
                });
            }
        });
    } catch (err) {
        console.error("Error in StudentCreateModel:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
}

const StudentCapturePayment = async (req, res) => {
    await db()
    const { paymentId, payerId, orderId, studentId } = req.body;
    
    console.log("Starting payment capture with:", { paymentId, payerId, orderId, studentId });
    
    try {
        // Find student
        const FindStudentInfo = await StudentModel.findOne({ userId: studentId });
        if (!FindStudentInfo) {
            console.error("Student not found for userId:", studentId);
            return res.status(404).json({
                success: false,
                message: "Student not found"
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

        console.log("Found order:", order);        // Execute the PayPal payment
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [{
                amount: {
                    currency: "USD",
                    total: parseFloat(order.coursePrice.toString()).toFixed(2)
                }
            }]
        };
        
        console.log("Executing payment with data:", {
            paymentId,
            execute_payment_json,
            orderTotal: order.coursePrice
        });

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

            console.log("PayPal payment executed successfully:", payment);            try {
                console.log("Payment execution result:", payment);
                
                // Update order status
                order.orderStatus = "Approval";
                order.paymentId = paymentId;
                order.payerId = payerId;
                await order.save();
                
                console.log("Order updated successfully:", order);

                // Check if student already has purchased courses
                let studentCourses = await StudentCoursePurchaseModel.findOne({
                    studentId: FindStudentInfo._id
                });
                
                if (studentCourses) {
                    // Check if course already exists in student's courses
                    const courseExists = studentCourses.course.some(
                        c => c.courseId.toString() === order.courseId.toString()
                    );

                    if (!courseExists) {
                        studentCourses.course.push({
                            courseId: order.courseId,
                            courseTitle: order.courseTitle,
                            instructorId: order.instructorId,
                            paid: order.coursePrice
                        });
                        await studentCourses.save();
                    }
                } else {
                    // Create new purchase record
                    studentCourses = new StudentCoursePurchaseModel({
                        studentId: FindStudentInfo._id,
                        course: [{
                            courseId: order.courseId,
                            courseTitle: order.courseTitle,
                            instructorId: order.instructorId,
                            paid: order.coursePrice
                        }]
                    });
                    await studentCourses.save();
                }

                // Update course with new student
                await courseModel.findByIdAndUpdate(order.courseId, {
                    $addToSet: {
                        students: {
                            studentId: FindStudentInfo._id,
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

module.exports = { StudentCreateModel, StudentCapturePayment }