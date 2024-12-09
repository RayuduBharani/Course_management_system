const LeadModel = require("../../Models/RBAC/LeadModel");
const StudentModel = require("../../Models/RBAC/StudentModel");
const StudentCoursePurchaseModel = require("../../Models/Student/PurchaseCourses");
const db = require("../../Utils/DB/db");
const jwt = require("jsonwebtoken");

const TeamAllocation = async (req, res) => {
    await db();
    try {
        const token = req.cookies[process.env.JWT_KEY];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        const findLeadTeamInfo = await LeadModel.findOne({ userId: decode.userId });
        
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

        res.send(findTeamMembersCourses);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
};

module.exports = { TeamAllocation };
