const StudentCoursePurchaseModel = require("../../Models/Student/PurchaseCourses")
const db = require("../../Utils/DB/db")


const StudentViewCurrentCourse = async (req, res) => {
    await db();
    const {id} = req.params
    // console.log(id)
    try {
        const studentCourses = await StudentCoursePurchaseModel.find({_id : id}).populate("studentId").populate("course.courseId");
        if(studentCourses){
            res.send({success : true , studentCourses : studentCourses})
        }
        else {
            res.send({success : false , message : "he is not purchasing any courses"})
        }
    }
    catch (err) {
        console.log("error " ,err)
        res.send({success : false , message : err.message})
    }
}

module.exports={StudentViewCurrentCourse};
