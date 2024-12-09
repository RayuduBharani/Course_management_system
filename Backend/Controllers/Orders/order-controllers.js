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
    const { paymentId, payerId, orderId, leadId } = req.body
    try {
        const LeadProfileId = await LeadModel.findOne({ userId: leadId })
        let order = await OrderModel.findById(Object(orderId))
        if (!order) {
            return res.send({
                message: "Order can't found",
                success: false
            })
        }
        order.orderStatus = "Approval"
        order.paymentId = paymentId
        order.payerId = payerId

        await order.save()

        // update the student/leadpurchaseCourse models 

        const leadCourses = await LeadCoursePurchaseModel.findOne({ leadId: LeadProfileId.__id })
        
        if (leadCourses){
            await LeadCoursePurchaseModel.findByIdAndUpdate(LeadProfileId._id, {
                $addToSet: {
                    course: {
                        courseId: order.courseId,
                        courseTitle: order.courseTitle,
                        instructorId: order.instructorId,
                        paid: order.coursePrice
                    }
                }
            })
        }

        else {
            const newLeadCourses = new LeadCoursePurchaseModel({
                leadId: LeadProfileId._id,
                course: [
                    {
                        courseId: order.courseId,
                        courseTitle: order.courseTitle,
                        instructorId: order.instructorId,
                        paid: order.coursePrice
                    }
                ]
            })
            await newLeadCourses.save()
        }

        const data = await courseModel.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                leads: {
                    leadId: LeadProfileId._id,
                    paidAmount: order.coursePrice,
                }
            }
        })
        if (data) {
            res.send({
                success: true,
                message: "Order Confirmed"
            })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
        console.log("order controller" ,err)
    }
}

module.exports = { CreateOrder, CapturePayment }