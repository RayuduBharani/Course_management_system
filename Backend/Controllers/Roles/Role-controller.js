const jwt = require('jsonwebtoken');
const InstuctureModel = require('../../Models/RBAC/InstructorModel');
const userModel = require('../../Models/RBAC/userModel');
const db = require('../../Utils/DB/db');
const LeadModel = require('../../Models/RBAC/LeadModel');
const StudentModel = require('../../Models/RBAC/StudentModel');

// Instucture Role 
const InstructureRole = async (req, res) => {
    await db()
    const UserInfo = req.body
    try {
        const cookiename = process.env.JWT_KEY
        const token = req.cookies[cookiename]
        const decode = jwt.verify(token, process.env.JWT_KEY)
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
            UPI : UserInfo.UPI ,
            gender : UserInfo.gender ,
            college : UserInfo.college
        })
        const FindUpdateUserRole = await userModel.findOne({ _id: decode.userId })
        if (FindUpdateUserRole) {
            await userModel.updateOne({ _id: decode.userId }, { $set: { role: "Instructor", image: UserInfo.profileImg } })
            const token = jwt.sign({
                userId: NewInstructorData.userId,
                name: NewInstructorData.name,
                image: NewInstructorData.image,
                email: NewInstructorData.email,
                role: NewInstructorData.role
            }, process.env.JWT_KEY);
            await NewInstructorData.save()
            res.cookie(process.env.JWT_KEY, token, {
                httpOnly: true,
                secure: false,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }).send({
                role: NewInstructorData.role,
                success: true,
                message: "You are registered as a Instructor",
                token: token
            })
        }
        else {
            res.send({
                success: true,
                message: "Unautharized user !"
            })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

// Team Lead Role 
const TeamLeadRole = async (req, res) => {
    await db()
    const UserInfo = req.body
    try {
        const cookiename = process.env.JWT_KEY
        const token = req.cookies[cookiename]
        const decode = jwt.verify(token, process.env.JWT_KEY)
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
        })
        const FindUpdateUserRole = await userModel.findOne({ _id: decode.userId })
        if (FindUpdateUserRole) {
            await userModel.updateOne({ _id: decode.userId }, { $set: { role: "Lead", image: UserInfo.profileImg } })
            const token = jwt.sign({
                userId: NewLeadData.userId,
                name: NewLeadData.name,
                image: NewLeadData.image,
                email: NewLeadData.email,
                role: NewLeadData.role,
                team: NewLeadData.teamNo
            }, process.env.JWT_KEY);
            await NewLeadData.save()
            res.cookie(process.env.JWT_KEY, token, {
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                secure: false,
            }).send({
                success: true,
                message: "You are registered as a Lead",
                token: token,
                role: NewLeadData.role
            })
        }
        else {
            res.send({
                success: true,
                message: "Unautharized user !"
            })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

// Student Role 
const StudentRole = async (req, res) => {
    await db()
    const UserInfo = req.body
    console.log(UserInfo)
    try {
        const cookiename = process.env.JWT_KEY
        const token = req.cookies[cookiename]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const existingStudent = await StudentModel.findOne({ email: decode.email });
        if (existingStudent) {
            return res.status(400).send({
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
        })
       
        const FindUpdateUserRole = await userModel.findOne({ _id: decode.userId })
        console.log(FindUpdateUserRole)
        if (FindUpdateUserRole) {
            await userModel.updateOne({ _id: decode.userId }, { $set: { role: "Student", image: UserInfo.profileImg } })
            await NewStudentData.save()
            const token = jwt.sign({
                userId: NewStudentData.userId,
                name: NewStudentData.name,
                image: NewStudentData.image,
                email: NewStudentData.email,
                role: NewStudentData.role,
                team: NewStudentData.teamNum
            }, process.env.JWT_KEY);
            res.cookie(process.env.JWT_KEY, token, {
                httpOnly: true,
                secure: false,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }).send({
                success: true,
                message: "You are registered as a Student",
                token: token,
                role: NewStudentData.role
            })
        }
        else {
            res.send({
                success: true,
                message: "Unautharized user !"
            })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

module.exports = { InstructureRole, TeamLeadRole, StudentRole }