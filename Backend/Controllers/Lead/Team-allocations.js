const LeadModel = require("../../Models/RBAC/LeadModel");
const StudentModel = require("../../Models/RBAC/StudentModel");
const StudentCoursePurchaseModel = require("../../Models/Student/PurchaseCourses");
const db = require("../../Utils/DB/db");
const jwt = require("jsonwebtoken");
const { COOKIE_NAME } = require("../auth/Auth-controller");

const JWT_SECRET = process.env.JWT_SECRET;

const TeamAllocation = async (req, res) => {
    await db();
    try {
        const token = req.cookies[COOKIE_NAME];
        const decode = jwt.verify(token, JWT_SECRET);
        const findLeadTeamInfo = await LeadModel.findOne({ userId: decode.userId });
        
        if (!findLeadTeamInfo) {
            return res.status(404).json({ success: false, message: "Lead profile not found" });
        }

        const findTeamMembers = await StudentModel.find({ teamNum: findLeadTeamInfo.teamNo });
        
        const findTeamMembersCourses = await Promise.all(
            findTeamMembers.map(async (member) => {
                const courses = await StudentCoursePurchaseModel
                    .find({ studentId: member._id })
                    .populate('course.courseId'); 

                return {
                    ...member._doc,
                    courses,
                };
            })
        );

        res.status(200).json({ success: true, data: findTeamMembersCourses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { TeamAllocation };
