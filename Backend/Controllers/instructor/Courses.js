const jwt = require('jsonwebtoken');
const db = require('../../Utils/DB/db');
const courseModel = require('../../Models/Instructor/Courses');
const InstuctureModel = require('../../Models/RBAC/InstructorModel');
const OrderModel = require('../../Models/Common/OrderModel');

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
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const FindInstructor = await InstuctureModel.find({ userId: decode.userId })
        const InstructorCourses = await courseModel.find({ instructor: FindInstructor[0]._id, isPublished: true }).populate("instructor")
        if (InstructorCourses) {
            res.send(InstructorCourses)
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

const GetOrderDetailes = async (req,res) => {
    await db()
    try {
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const findInstructor = await InstuctureModel.findOne({userId : decode.userId})
        const findOrder = await OrderModel.find({instructorId : findInstructor._id})
        if(findOrder){
            res.send(findOrder)
        }
    } 
    catch (err) {
        res.send({success : false , message : err.message})
    }
}

module.exports = { AddCourse, GetInstructorCourses , GetOrderDetailes }