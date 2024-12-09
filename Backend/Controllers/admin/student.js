const StudentModel = require("../../Models/RBAC/StudentModel")
const db = require("../../Utils/DB/db")


const GetAllTheStudents = async (req, res) => {
    await db()
    try {
        const studentData = await StudentModel.find()
        const findTeamMembersCourses = await Promise.all(
            studentData.map(async (member) => {
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
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

const DeleteTheStudent = async (req, res) => {
    await db()
    try {
        
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

module.exports = { GetAllTheStudents, DeleteTheStudent }