const OrderModel = require("../../Models/Common/OrderModel");
const courseModel = require("../../Models/Instructor/Courses")
const db = require("../../Utils/DB/db")


const CourseDeletion = async (req, res) => {
    await db()
    const { id } = req.params;
    try {
        const findTheCourse = await courseModel.findOne({ _id: id })
        if (findTheCourse) {
            findTheCourse.isPublished = false
            await findTheCourse.save()
            res.status(200).json({ success: true, message: "Course Unpublished" })
        }
        else {
            res.status(404).json({ success: false, message: "Course not found" })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to unpublish course" })
    }
}


const LeadCourseView = async (req, res) => {
    await db();

    const { id } = req.params;
    try {
        const findAllCourses = await courseModel.findOne({ _id: id })
        if (findAllCourses) {
            res.status(200).json({ success: true, findAllCourses: findAllCourses })
        } else {
            res.status(404).json({ success: false, message: "Course not found" })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch course" })
    }

}

const accessOrders = async (req, res) => {
    await db()
    try {
        const orders = await OrderModel.find().sort({ createdAt: -1 })
        res.status(200).json({ success: true, orders: orders || [] })
    } 
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch orders" })
    }
}

module.exports = { CourseDeletion, LeadCourseView , accessOrders }