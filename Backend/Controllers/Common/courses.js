const db = require("../../Utils/DB/db")
const courseModel = require("../../Models/Instructor/Courses")


const Allcourses = async (req, res) => {
    await db()
    try {
        const AllcoursesList = await courseModel.find({ isPublished: true }).populate("instructor")        
        if(AllcoursesList){
            res.send(AllcoursesList)
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

const SingleCourseView = async (req,res) => {
    await db()
    const {id} = req.params
    try {
        const CourseData = await courseModel.findOne({_id : id}).populate("instructor")
        res.send(CourseData)
    } 
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

module.exports = { Allcourses  , SingleCourseView}