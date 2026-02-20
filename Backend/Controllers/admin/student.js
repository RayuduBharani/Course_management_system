const StudentModel = require("../../Models/RBAC/StudentModel")
const StudentCoursePurchaseModel = require("../../Models/Student/PurchaseCourses")
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

        res.status(200).json({ success: true, data: findTeamMembersCourses });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch students" })
    }
}

const DeleteTheStudent = async (req, res) => {
    await db()
    const { id } = req.params;
    try {
        const student = await StudentModel.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        await StudentCoursePurchaseModel.deleteMany({ studentId: student._id });
        await StudentModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Student deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete student" })
    }
}

module.exports = { GetAllTheStudents, DeleteTheStudent }