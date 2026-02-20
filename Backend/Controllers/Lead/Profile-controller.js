const LeadModel = require("../../Models/RBAC/LeadModel")
const userModel = require("../../Models/RBAC/userModel")
const db = require("../../Utils/DB/db")
const jwt = require("jsonwebtoken")
const { COOKIE_NAME } = require("../auth/Auth-controller")

const JWT_SECRET = process.env.JWT_SECRET;

const ProfileInfo = async (req, res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, JWT_SECRET)
        const FetchUserInfo = await LeadModel.findOne({ userId: decode.userId })
        if(FetchUserInfo){
            res.status(200).json({ success: true, data: FetchUserInfo })
        } else {
            res.status(404).json({ success: false, message: "Profile not found" })
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

const UpdateProfile = async (req, res) => {
    await db()
    try {
        const token = req.cookies[COOKIE_NAME]
        const decode = jwt.verify(token, JWT_SECRET)
        const UpdateProfileData = req.body

        const FindUserInfo = await LeadModel.findOne({ userId: decode.userId })
        const FindUserProfile = await userModel.findById(FindUserInfo.userId)

        if(FindUserInfo && FindUserProfile) {
            FindUserInfo.name = UpdateProfileData.name || FindUserInfo.name
            FindUserInfo.rollNumber = UpdateProfileData.rollNumber || FindUserInfo.rollNumber
            FindUserInfo.branch = UpdateProfileData.branch || FindUserInfo.branch
            FindUserInfo.profileImg = UpdateProfileData.profileImg || FindUserInfo.profileImg
            FindUserInfo.gender = UpdateProfileData.gender || FindUserInfo.gender
            FindUserProfile.name = UpdateProfileData.name || FindUserProfile.name
            FindUserProfile.image = UpdateProfileData.profileImg || FindUserProfile.image
            await FindUserInfo.save()
            await FindUserProfile.save()
            res.status(200).json({ success: true, message: "Profile updated successfully", data: FindUserInfo })
        } else {
            res.status(404).json({ success: false, message: "Profile not found" })
        }
    } 
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}
module.exports = { ProfileInfo , UpdateProfile } 