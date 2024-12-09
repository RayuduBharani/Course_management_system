const InstuctureModel = require("../../Models/RBAC/InstructorModel")
const userModel = require("../../Models/RBAC/userModel")
const db = require("../../Utils/DB/db")
const jwt = require("jsonwebtoken")


const instructorProfile = async (req, res) => {
    await db()
    try {
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const findProfileInfo = await InstuctureModel.findOne({ userId: decode.userId })
        if (findProfileInfo) {
            res.send(findProfileInfo)
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

const updateProfile = async (req,res) => {
    await db()
    const UpdateProfileData = req.body
    try {
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)

        const FindUserInfo = await InstuctureModel.findOne({ userId: decode.userId })
        const FindUserProfile = await userModel.findById(decode.userId)

        if (FindUserInfo && FindUserInfo) {
            FindUserInfo.name = UpdateProfileData.name || FindUserInfo.name
            FindUserInfo.rollNumber = UpdateProfileData.rollNumber || FindUserInfo.rollNumber
            FindUserInfo.branch = UpdateProfileData.branch || FindUserInfo.branch
            FindUserInfo.profileImg = UpdateProfileData.profileImg || FindUserInfo.profileImg
            FindUserInfo.gender = UpdateProfileData.gender || FindUserInfo.gender
            FindUserInfo.college = UpdateProfileData.college || FindUserInfo.college
            FindUserInfo.UPI = UpdateProfileData.UPI || FindUserInfo.UPI
            FindUserInfo.gitHub = UpdateProfileData.gitHub || FindUserInfo.gitHub
            FindUserInfo.linkedIn = UpdateProfileData.linkedIn || FindUserInfo.linkedIn

            FindUserProfile.name = UpdateProfileData.name || FindUserProfile.name
            FindUserProfile.image = UpdateProfileData.profileImg || FindUserProfile.image
            await FindUserInfo.save()
            await FindUserProfile.save()
            res.send({success : true , message : "Profile Updated"})
        }
    }
    catch (err) {
        console.log(err)
        res.send({ success: false, message: err.message })
    }
}

module.exports = { instructorProfile, updateProfile }