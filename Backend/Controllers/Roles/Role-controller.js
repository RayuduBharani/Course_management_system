const InstuctureModel = require('../../Models/RBAC/InstructorModel');
const userModel = require('../../Models/RBAC/userModel');
const db = require('../../Utils/DB/db');
const LeadModel = require('../../Models/RBAC/LeadModel');
const StudentModel = require('../../Models/RBAC/StudentModel');
const jwt = require("jsonwebtoken");

// Instucture Role 
const InstructureRole = async (req, res) => {
    await db()
    const UserInfo = req.body
    try {
        const cookiename = "BHARANI"
        const token = req.cookies[cookiename]
        const decode = jwt.verify(token, "BHARANI")
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
            }, "BHARANI");
            await NewInstructorData.save()
            return res.cookie("BHARANI", token, {
                httpOnly: true,
                secure: false,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }).json({
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
        console.log(err)
        res.send({ success: false, message: err })
    }
}

// Team Lead Role 
const TeamLeadRole = async (req, res) => {
    await db()
    const UserInfo = req.body
    try {
        // const cookiename = "BHARANI"
        const token = req.cookies.BHARANI
        const decode = jwt.verify(token, "BHARANI")
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
            }, "BHARANI");
            await NewLeadData.save()
            res.cookie("BHARANI", token, {
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
            console.log(err)
            res.send({
                success: true,
                message: "Unautharized user !"
            })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ success: false, message: err})
    }
}

// Student Role 
const StudentRole = async (req, res) => {
    await db()
    const UserInfo = req.body
    console.log(UserInfo)
    try {
        const cookiename = "BHARANI"
        console.log(cookiename)
        const token = req.cookies[cookiename]
        console.log(token)
        const decode = jwt.verify(token, "BHARANI")
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
            }, "BHARANI");
            res.cookie("BHARANI", token, {
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
        console.log(err)
        res.send({ success: false, message: err.message })
    }
}

module.exports = { InstructureRole, TeamLeadRole, StudentRole }