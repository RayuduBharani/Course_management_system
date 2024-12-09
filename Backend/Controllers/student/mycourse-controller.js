const StudentModel = require("../../Models/RBAC/StudentModel");
const StudentCoursePurchaseModel = require("../../Models/Student/PurchaseCourses");
const db = require("../../Utils/DB/db")
const jwt = require('jsonwebtoken');

const GetMyCourse = async (req, res) => {
    await db()
    try {
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const leadData = await StudentModel.findOne({userId : decode.userId})
        const studentCourses = await StudentCoursePurchaseModel.find({studentId : leadData._id}).populate("studentId").populate("course.courseId");
        if(studentCourses){
            res.send({success : true , studentCourses : studentCourses})
        }
        else {
            res.send({success : false , message : "he is not purchasing any courses"})
        }
    }
    catch (err) {
        console.log(err)
        res.send({success : false , message : err.message})
    }
}

const SearchCourses = async (req, res) => {
    await db();
    const { name } = req.params;
    
    try {
        const token = req.cookies[process.env.JWT_KEY];
        const decode = jwt.verify(token, process.env.JWT_KEY);

        const studentData = await StudentModel.findOne({ userId: decode.userId });
        const studentCourses = await StudentCoursePurchaseModel.find({ studentId: studentData._id })
            .populate("studentId")
            .populate("course.courseId");

        const searchWords = name.toLowerCase().split(' ');

        const matchingCourses = studentCourses.filter((data) => {
            const courseTitle = data.course[0].courseId.title.toLowerCase();
            
            return searchWords.some((word) => courseTitle.includes(word));
        });

        if (matchingCourses.length > 0) {
            // console.log(matchingCourses);
            res.send({ success: true, studentCourses: matchingCourses });
        } else {
            res.send({ success: false, message: "No matching courses found" });
        }
    } catch (err) {
        console.log("this happened", err);
        res.send({ success: false, message: err.message });
    }
};


module.exports = { GetMyCourse  , SearchCourses}