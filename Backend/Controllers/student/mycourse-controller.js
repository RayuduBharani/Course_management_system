const StudentModel = require("../../Models/RBAC/StudentModel");
const StudentCoursePurchaseModel = require("../../Models/Student/PurchaseCourses");
const db = require("../../Utils/DB/db")
const jwt = require('jsonwebtoken');
const { COOKIE_NAME } = require("../auth/Auth-controller");

const JWT_SECRET = process.env.JWT_SECRET;

const GetMyCourse = async (req, res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, JWT_SECRET)
        const studentData = await StudentModel.findOne({userId : decode.userId})
        if (!studentData) {
            return res.status(404).json({ success: false, message: "Student profile not found" })
        }
        const studentCourses = await StudentCoursePurchaseModel.find({studentId : studentData._id}).populate("studentId").populate("course.courseId");
        if(studentCourses && studentCourses.length > 0){
            res.status(200).json({success : true , studentCourses : studentCourses})
        }
        else {
            res.status(200).json({success : true , studentCourses : [], message : "No courses purchased yet"})
        }
    }
    catch (err) {
        res.status(500).json({success : false , message : err.message})
    }
}

const SearchCourses = async (req, res) => {
    await db();
    const { name } = req.params;
    
    try {
        const token = req.cookies[COOKIE_NAME];
        const decode = jwt.verify(token, JWT_SECRET);

        const studentData = await StudentModel.findOne({ userId: decode.userId });
        if (!studentData) {
            return res.status(404).json({ success: false, message: "Student profile not found" });
        }
        const studentCourses = await StudentCoursePurchaseModel.find({ studentId: studentData._id })
            .populate("studentId")
            .populate("course.courseId");

        const searchWords = name.toLowerCase().split(' ');

        const matchingCourses = studentCourses.filter((data) => {
            const courseTitle = data.course?.[0]?.courseId?.title?.toLowerCase() || '';
            return searchWords.some((word) => courseTitle.includes(word));
        });

        if (matchingCourses.length > 0) {
            res.status(200).json({ success: true, studentCourses: matchingCourses });
        } else {
            res.status(200).json({ success: true, studentCourses: [], message: "No matching courses found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


module.exports = { GetMyCourse  , SearchCourses}