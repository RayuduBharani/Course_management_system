const StudentCoursePurchaseModel = require("../../Models/Student/PurchaseCourses")
const db = require("../../Utils/DB/db")


const StudentViewCurrentCourse = async (req, res) => {
    await db();
    const {id} = req.params
    try {
        const studentCourses = await StudentCoursePurchaseModel.find({_id : id}).populate("studentId").populate("course.courseId");
        if(studentCourses && studentCourses.length > 0){
            res.status(200).json({success : true , studentCourses : studentCourses})
        }
        else {
            res.status(404).json({success : false , message : "Course not found"})
        }
    }
    catch (err) {
        res.status(500).json({success : false , message : err.message})
    }
}

module.exports={StudentViewCurrentCourse};
