const InstuctureModel = require('../../Models/RBAC/InstructorModel');
const userModel = require('../../Models/RBAC/userModel');
const db = require('../../Utils/DB/db');
const LeadModel = require('../../Models/RBAC/LeadModel');
const StudentModel = require('../../Models/RBAC/StudentModel');
const jwt = require("jsonwebtoken");

// Helper function to verify token
const verifyAuthToken = (req) => {
    const token = req.cookies[process.env.JWT_KEY];
    if (!token) {
        throw new Error("Authentication token not found");
    }
    return jwt.verify(token, process.env.JWT_KEY);
};

// Instructor Role 
const InstructureRole = async (req, res) => {
    await db();
    const UserInfo = req.body;
    try {
        const decode = verifyAuthToken(req);
        const existingInstructor = await InstuctureModel.findOne({ email: decode.email });
        if (existingInstructor) {
            return res.status(400).json({
                success: false,
                message: "Instructor with this email already exists!"
            });
        }

        const NewInstructorData = new InstuctureModel({
            userId: decode.userId,
            name: decode.name,
            rollNumber: UserInfo.rollNumber,
            branch: UserInfo.branch,
            email: decode.email,
            profileImg: UserInfo.profileImg,
            role: "Instructor",
            linkedIn: UserInfo.linkedIn,
            gitHub: UserInfo.gitHub,
            UPI: UserInfo.UPI,
            gender: UserInfo.gender,
            college: UserInfo.college
        });

        const FindUpdateUserRole = await userModel.findOne({ _id: decode.userId });
        if (!FindUpdateUserRole) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await userModel.updateOne(
            { _id: decode.userId },
            { $set: { role: "Instructor", image: UserInfo.profileImg } }
        );
        
        await NewInstructorData.save();

        const token = jwt.sign({
            userId: NewInstructorData.userId,
            name: NewInstructorData.name,
            image: NewInstructorData.profileImg,
            email: NewInstructorData.email,
            role: NewInstructorData.role
        }, process.env.JWT_KEY);

        res.cookie(process.env.JWT_KEY, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }).json({
            success: true,
            message: "You are registered as an Instructor",
            role: NewInstructorData.role,
            data: {
                name: NewInstructorData.name,
                email: NewInstructorData.email,
                image: NewInstructorData.profileImg
            }
        });
    } catch (err) {
        console.error("InstructureRole error:", err);
        res.status(err.message === "Authentication token not found" ? 401 : 500)
           .json({
                success: false,
                message: err.message || "Internal server error"
           });
    }
};

// Team Lead Role 
const TeamLeadRole = async (req, res) => {
    await db();
    const UserInfo = req.body;
    try {
        const decode = verifyAuthToken(req);
        const existingLead = await LeadModel.findOne({ email: decode.email });
        if (existingLead) {
            return res.status(400).json({
                success: false,
                message: "Lead with this email already exists!"
            });
        }

        const NewLeadData = new LeadModel({
            userId: decode.userId,
            name: decode.name,
            rollNumber: UserInfo.rollNumber,
            branch: UserInfo.branch,
            email: decode.email,
            profileImg: UserInfo.profileImg,
            role: "Lead",
            teamNo: UserInfo.teamNo,
            gender: UserInfo.gender
        });

        const FindUpdateUserRole = await userModel.findOne({ _id: decode.userId });
        if (!FindUpdateUserRole) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await userModel.updateOne(
            { _id: decode.userId },
            { $set: { role: "Lead", image: UserInfo.profileImg } }
        );
        
        await NewLeadData.save();

        const token = jwt.sign({
            userId: NewLeadData.userId,
            name: NewLeadData.name,
            image: NewLeadData.profileImg,
            email: NewLeadData.email,
            role: NewLeadData.role,
            team: NewLeadData.teamNo
        }, process.env.JWT_KEY);

        res.cookie(process.env.JWT_KEY, token, {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }).json({
            success: true,
            message: "You are registered as a Lead",
            role: NewLeadData.role,
            data: {
                name: NewLeadData.name,
                email: NewLeadData.email,
                image: NewLeadData.profileImg,
                team: NewLeadData.teamNo
            }
        });
    } catch (err) {
        console.error("TeamLeadRole error:", err);
        res.status(err.message === "Authentication token not found" ? 401 : 500)
           .json({
                success: false,
                message: err.message || "Internal server error"
           });
    }
};

// Student Role 
const StudentRole = async (req, res) => {
    await db();
    const UserInfo = req.body;
    try {
        const decode = verifyAuthToken(req);
        const existingStudent = await StudentModel.findOne({ email: decode.email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student with this email already exists!"
            });
        }

        const NewStudentData = new StudentModel({
            userId: decode.userId,
            name: decode.name,
            rollNumber: UserInfo.rollNumber,
            branch: UserInfo.branch,
            email: decode.email,
            profileImg: UserInfo.profileImg,
            role: "Student",
            teamNum: UserInfo.teamNum,
            gender: UserInfo.gender
        });

        const FindUpdateUserRole = await userModel.findOne({ _id: decode.userId });
        if (!FindUpdateUserRole) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await userModel.updateOne(
            { _id: decode.userId },
            { $set: { role: "Student", image: UserInfo.profileImg } }
        );
        
        await NewStudentData.save();

        const token = jwt.sign({
            userId: NewStudentData.userId,
            name: NewStudentData.name,
            image: NewStudentData.profileImg,
            email: NewStudentData.email,
            role: NewStudentData.role,
            team: NewStudentData.teamNum
        }, process.env.JWT_KEY);

        res.cookie(process.env.JWT_KEY, token, {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }).json({
            success: true,
            message: "You are registered as a Student",
            role: NewStudentData.role,
            data: {
                name: NewStudentData.name,
                email: NewStudentData.email,
                image: NewStudentData.profileImg,
                team: NewStudentData.teamNum
            }
        });
    } catch (err) {
        console.error("StudentRole error:", err);
        res.status(err.message === "Authentication token not found" ? 401 : 500)
           .json({
                success: false,
                message: err.message || "Internal server error"
           });
    }
};

module.exports = { InstructureRole, TeamLeadRole, StudentRole };