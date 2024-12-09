const LeadCoursePurchaseModel = require("../../Models/Lead/PurchaseCourses")
const LeadModel = require("../../Models/RBAC/LeadModel")
const db = require("../../Utils/DB/db")
const jwt = require('jsonwebtoken');

const GetMyCourse = async (req, res) => {
    await db()
    try {
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const leadData = await LeadModel.findOne({userId : decode.userId})
        const leadCourses = await LeadCoursePurchaseModel.find({leadId : leadData._id}).populate("leadId").populate("course.courseId");
        if(leadCourses){
            res.send({success : true , leadCourses : leadCourses})
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

const SearchCourses = async (req,res) => {
    await db()
    const {name} = req.params
    try {
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const leadData = await LeadModel.findOne({userId : decode.userId})
        const leadCourses = await LeadCoursePurchaseModel.find({leadId : leadData._id}).populate("leadId").populate("course.courseId");
        const searchWords = name.split(' ');

        const matchingCourses = leadCourses.filter((data) => 
            searchWords.some((word) =>
                data.course[0].courseTitle.toLowerCase().includes(word.toLowerCase())
            )
        );

        if (matchingCourses.length > 0) {
            res.send({ success: true, leadCourses: matchingCourses });
        } else {
            res.send({ success: false, message: "No matching courses found" });
        }
    }
    catch (err) {
        console.log("this happened" ,err)
        res.send({success : false , message : err.message})
    }
}

module.exports = { GetMyCourse , SearchCourses }