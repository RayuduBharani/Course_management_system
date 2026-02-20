const db = require("../../Utils/DB/db")
const courseModel = require("../../Models/Instructor/Courses")


const Allcourses = async (req, res) => {
    await db()
    try {
        const AllcoursesList = await courseModel.find({ isPublished: true }).populate("instructor")        
        res.status(200).json({ success: true, courses: AllcoursesList })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

const SingleCourseView = async (req,res) => {
    await db()
    const {id} = req.params
    try {
        const CourseData = await courseModel.findOne({_id : id}).populate("instructor")
        if (CourseData) {
            res.status(200).json({ success: true, course: CourseData })
        } else {
            res.status(404).json({ success: false, message: "Course not found" })
        }
    } 
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = { Allcourses  , SingleCourseView}