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
                return_url: `${process.env.ClIENT_URL}/student/payment-return`,
                cancel_url: `${process.env.ClIENT_URL}/student/payment-cancel`
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

const StudentCapturePayment = async (req, res) => {
    await db()
    const { paymentId, payerId, orderId, studentId } = req.body
    console.log(studentId)
    try {
        const FindStudentInfo = await StudentModel.findOne({ userId: studentId })
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

        const newStudentCourses = new StudentCoursePurchaseModel({
            studentId: FindStudentInfo._id,
            course: [
                {
                    courseId: order.courseId,
                    courseTitle: order.courseTitle,
                    instructorId: order.instructorId,
                    paid: order.coursePrice
                }
            ]
        })
        await newStudentCourses.save()

        await courseModel.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: FindStudentInfo._id,
                    paidAmount: order.coursePrice,
                }
            }
        })
        res.send({
            success: true,
            message: "Order Confirmed"
        })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
        console.log(err)
    }
}

module.exports = { StudentCreateModel, StudentCapturePayment }