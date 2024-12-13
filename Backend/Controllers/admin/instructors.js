const OrderModel = require("../../Models/Common/OrderModel")
const courseModel = require("../../Models/Instructor/Courses")
const InstuctureModel = require("../../Models/RBAC/InstructorModel")
const db = require("../../Utils/DB/db")



const fetchAllTheInstructors = async(req , res) => {
    await db()
    try {
        const data = await InstuctureModel.find()
        if (data) {
            res.send(data)
        }
        else {
            res.send({ success: false, message: "Some err happened" })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

const fetchTheInstructorsCourses = async(req,res)=> {
    await db()
    const userId = req.params.id
    try {
        const findData = await OrderModel.find({instructorId : userId}).populate("instructorId")
        if(findData){
            res.send(findData)  
        }
    }
    catch (err) {
       res.send({success : false , message : err.message}) 
    }
}

module.exports = {fetchAllTheInstructors , fetchTheInstructorsCourses}