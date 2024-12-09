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
            findTheCourse.save()
            res.send({ success: true, message: "Course Unpublished" })
        }
        else {
            res.send({ success: false, message: "Some err happened" })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}


const LeadCourseView = async (req, res) => {
    await db();

    const { id } = req.params;
    try {
        const findAllCourses = await courseModel.findOne({ _id: id })
        if (findAllCourses) {
            res.send({ sucess: true, findAllCourses: findAllCourses })
        } else {
            res.send({ sucess: false, message: "Error getting in courses!" })
        }
    }
    catch (err) {
        res.send({ sucess: false, message: err.message })
    }

}

const accessOrders = async (req, res) => {
    await db()
    try {
        const orders = await OrderModel.find()
        if(orders){
            res.send(orders)
        }
    } 
    catch (err) {
        res.send({success : false , message : err.message})
    }
}

module.exports = { CourseDeletion, LeadCourseView , accessOrders }