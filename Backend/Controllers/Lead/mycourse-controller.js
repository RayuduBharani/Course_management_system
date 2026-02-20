const LeadCoursePurchaseModel = require("../../Models/Lead/PurchaseCourses")
const LeadModel = require("../../Models/RBAC/LeadModel")
const db = require("../../Utils/DB/db")
const jwt = require('jsonwebtoken');
const { COOKIE_NAME } = require("../auth/Auth-controller");

const JWT_SECRET = process.env.JWT_SECRET;

const GetMyCourse = async (req, res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, JWT_SECRET)
        const leadData = await LeadModel.findOne({userId : decode.userId})
        const leadCourses = await LeadCoursePurchaseModel.find({leadId : leadData._id}).populate("leadId").populate("course.courseId");
        if(leadCourses && leadCourses.length > 0){
            res.status(200).json({success : true , leadCourses : leadCourses})
        }
        else {
            res.status(200).json({success : true , leadCourses : [], message : "No courses purchased yet"})
        }
    }
    catch (err) {
        res.status(500).json({success : false , message : err.message})
    }
}

const SearchCourses = async (req,res) => {
    await db()
    const {name} = req.params
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, JWT_SECRET)
        const leadData = await LeadModel.findOne({userId : decode.userId})
        if (!leadData) {
            return res.status(404).json({ success: false, message: "Lead profile not found" })
        }
        const leadCourses = await LeadCoursePurchaseModel.find({leadId : leadData._id}).populate("leadId").populate("course.courseId");
        const searchWords = name.toLowerCase().split(' ');

        const matchingCourses = leadCourses.filter((data) => {
            const title = data.course?.[0]?.courseTitle?.toLowerCase() || '';
            return searchWords.some((word) => title.includes(word));
        });

        if (matchingCourses.length > 0) {
            res.status(200).json({ success: true, leadCourses: matchingCourses });
        } else {
            res.status(200).json({ success: true, leadCourses: [], message: "No matching courses found" });
        }
    }
    catch (err) {
        res.status(500).json({success : false , message : err.message})
    }
}

module.exports = { GetMyCourse , SearchCourses }