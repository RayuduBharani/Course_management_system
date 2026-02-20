const jwt = require("jsonwebtoken")
const StudentModel = require("../../Models/RBAC/StudentModel")
const userModel = require("../../Models/RBAC/userModel")
const db = require("../../Utils/DB/db")
const { COOKIE_NAME } = require("../auth/Auth-controller")

const JWT_SECRET = process.env.JWT_SECRET;

const StudentProfileInfo = async (req, res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, JWT_SECRET)

        const FindUserData = await StudentModel.findOne({ userId: decode.userId })
        if (FindUserData) {
            res.status(200).json({
                success: true,
                FindUserData : FindUserData
            })
        } else {
            res.status(404).json({ success: false, message: "Student profile not found" })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

const StdentUpdateProfile = async (req, res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, JWT_SECRET)
        const UpdateProfileData = req.body

        const FindUserInfo = await StudentModel.findOne({ userId: decode.userId })
        const FindUserProfile = await userModel.findById(FindUserInfo.userId)

        if (FindUserInfo && FindUserProfile) {
            FindUserInfo.name = UpdateProfileData.name || FindUserInfo.name
            FindUserInfo.rollNumber = UpdateProfileData.rollNumber || FindUserInfo.rollNumber
            FindUserInfo.branch = UpdateProfileData.branch || FindUserInfo.branch
            FindUserInfo.profileImg = UpdateProfileData.profileImg || FindUserInfo.profileImg
            FindUserInfo.gender = UpdateProfileData.gender || FindUserInfo.gender
            FindUserInfo.teamNum = UpdateProfileData.teamNum || FindUserInfo.teamNum

            FindUserProfile.name = UpdateProfileData.name || FindUserProfile.name
            FindUserProfile.image = UpdateProfileData.profileImg || FindUserProfile.image
            await FindUserInfo.save()
            await FindUserProfile.save()
            res.status(200).json({ success: true, message: "Profile updated successfully", data: FindUserInfo })
        } else {
            res.status(404).json({ success: false, message: "Student profile not found" })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}


module.exports = { StudentProfileInfo, StdentUpdateProfile }