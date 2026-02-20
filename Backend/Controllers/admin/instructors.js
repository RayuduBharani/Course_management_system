const OrderModel = require("../../Models/Common/OrderModel")
const courseModel = require("../../Models/Instructor/Courses")
const InstructorModel = require("../../Models/RBAC/InstructorModel")
const db = require("../../Utils/DB/db")



const fetchAllTheInstructors = async(req , res) => {
    await db()
    try {
        const data = await InstructorModel.find()
        res.status(200).json({ success: true, data: data || [] })
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch instructors" })
    }
}

const fetchTheInstructorsCourses = async(req,res)=> {
    await db()
    const userId = req.params.id
    try {
        const findData = await OrderModel.find({instructorId : userId}).populate("instructorId")
        res.status(200).json({ success: true, data: findData || [] })
    }
    catch (err) {
       res.status(500).json({ success: false, message: "Failed to fetch instructor courses" })
    }
}

module.exports = {fetchAllTheInstructors , fetchTheInstructorsCourses}