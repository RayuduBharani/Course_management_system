const jwt = require('jsonwebtoken');
const db = require('../../Utils/DB/db');
const courseModel = require('../../Models/Instructor/Courses');
const InstuctureModel = require('../../Models/RBAC/InstructorModel');
const OrderModel = require('../../Models/Common/OrderModel');
const WithdrawalRequest = require('../../Models/Instructor/WithdrawalRequest'); // Assuming the path to WithdrawalRequest model

const AddCourse = async (req, res) => {
    await db()
    const AddCourseInfo = req.body
    try {
        const token = req.cookies[process.env.JWT_KEY]
        // const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const instructor = await InstuctureModel.findOne({ userId: decode.userId });
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
            price: AddCourseInfo.price
        }

        const Course = await courseModel.create(NewAddCourseData)
        instructor.courseId.push(Course._id)
        await instructor.save();
        await InstuctureModel.updateOne({ _id: decode.userId }, { $set: { courseId: instructor.courseId } })
        if (Course) {
            res.send({ success: true, message: "Course Added" })
        }
        else {
            res.send({ success: false, message: "Some err happened" })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
        console.log(err)
    }
}

const GetInstructorCourses = async (req, res) => {
    await db()
    try {
        console.log("Getting instructor courses...")
        const token = req.cookies[process.env.JWT_KEY]
        if (!token) {
            console.log("No token found in cookies")
            return res.status(401).json({ success: false, message: "No authentication token" })
        }
        console.log("Token found:", token.substring(0, 10) + "...")
        
        const decode = jwt.verify(token, process.env.JWT_KEY)
        console.log("Decoded user ID:", decode.userId)
        
        const FindInstructor = await InstuctureModel.find({ userId: decode.userId })
        if (!FindInstructor || FindInstructor.length === 0) {
            console.log("No instructor found for userId:", decode.userId)
            return res.status(404).json({ success: false, message: "Instructor not found" })
        }
        console.log("Found instructor:", FindInstructor[0]._id)
        
        const InstructorCourses = await courseModel.find({ instructor: FindInstructor[0]._id, isPublished: true }).populate("instructor")
        console.log("Found courses:", InstructorCourses.length)
        
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
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const findInstructor = await InstuctureModel.findOne({userId : decode.userId})
        
        // Get all orders for this instructor
        const findOrders = await OrderModel.find({instructorId : findInstructor._id})
        
        // Get all withdrawal requests for this instructor 
        const withdrawalRequests = await WithdrawalRequest.find({
            instructorId: findInstructor._id,
            status: { $in: ['pending', 'approved'] }
        })

        // Calculate total approved/completed course payments
        const completedPayments = findOrders
            .filter(order => order.orderStatus === "Approval")
            .reduce((total, order) => total + parseFloat(order.coursePrice), 0)

        // Calculate total withdrawn/pending withdrawal amount
        const withdrawnAmount = withdrawalRequests.reduce((total, req) => {
            return total + req.amount
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