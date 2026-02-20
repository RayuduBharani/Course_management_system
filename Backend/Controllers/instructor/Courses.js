const jwt = require('jsonwebtoken');
const db = require('../../Utils/DB/db');
const courseModel = require('../../Models/Instructor/Courses');
const InstructorModel = require('../../Models/RBAC/InstructorModel');
const OrderModel = require('../../Models/Common/OrderModel');
const WithdrawalRequest = require('../../Models/Instructor/WithdrawalRequest');
const { COOKIE_NAME } = require('../auth/Auth-controller');

const AddCourse = async (req, res) => {
    await db()
    const AddCourseInfo = req.body
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const instructor = await InstructorModel.findOne({ userId: decode.userId });
        if (!instructor) {
            return res.status(404).json({ success: false, message: "Instructor not found" })
        }
        const NewAddCourseData = {
            instructor: instructor._id,
            title: AddCourseInfo.title,
            subtitle: AddCourseInfo.subtitle,
            description: AddCourseInfo.description,
            category: AddCourseInfo.category,
            objectives: AddCourseInfo.objectives,
            level: AddCourseInfo.Level,
            leads: AddCourseInfo.leads || [],
            students: AddCourseInfo.students || [],
            requirements: AddCourseInfo.requirements,
            files: AddCourseInfo.files,
            thumbnail: AddCourseInfo.thumbnail,
            price: AddCourseInfo.price,
            isPublished: true
        }

        const Course = await courseModel.create(NewAddCourseData)
        instructor.courseId.push(Course._id)
        await instructor.save();
        if (Course) {
            res.status(201).json({ success: true, message: "Course Added" })
        }
        else {
            res.status(500).json({ success: false, message: "Failed to add course" })
        }
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Failed to add course" })
    }
}

const GetInstructorCourses = async (req, res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        if (!token) {
            return res.status(401).json({ success: false, message: "No authentication token" })
        }
        
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        
        const FindInstructor = await InstructorModel.find({ userId: decode.userId })
        if (!FindInstructor || FindInstructor.length === 0) {
            return res.status(404).json({ success: false, message: "Instructor not found" })
        }
        
        const InstructorCourses = await courseModel.find({ instructor: FindInstructor[0]._id, isPublished: true }).populate("instructor")
        
        res.json({ success: true, courses: InstructorCourses })
    }
    catch (err) {
        console.error("Error in GetInstructorCourses:", err)
        res.status(500).json({ success: false, message: err.message })
    }
}

const GetOrderDetailes = async (req,res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const findInstructor = await InstructorModel.findOne({userId : decode.userId})
        
        // Get all orders for this instructor
        const findOrders = await OrderModel.find({instructorId : findInstructor._id})
        
        // Get all withdrawal requests for this instructor 
        const withdrawalRequests = await WithdrawalRequest.find({
            instructorId: findInstructor._id,
            status: { $in: ['pending', 'approved'] }
        })

        const completedPayments = findOrders
            .filter(order => order.orderStatus === "Approved")
            .reduce((total, order) => total + (Number(order.coursePrice) || 0), 0)

        // Calculate total withdrawn/pending withdrawal amount
        const withdrawnAmount = withdrawalRequests.reduce((total, wr) => {
            return total + wr.amount
        }, 0)

        // Calculate available balance
        const availableBalance = completedPayments - withdrawnAmount

        if(findOrders){
            res.send({
                orders: findOrders,
                availableBalance,
                withdrawalRequests
            })
        } else {
            res.send({
                success: false,
                message: "No orders found",
                availableBalance: 0,
                withdrawalRequests: []
            })
        }
    } 
    catch (err) {
        res.send({success : false , message : err.message})
    }
}

module.exports = { AddCourse, GetInstructorCourses , GetOrderDetailes }