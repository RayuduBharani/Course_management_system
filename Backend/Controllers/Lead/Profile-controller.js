const LeadModel = require("../../Models/RBAC/LeadModel")
const userModel = require("../../Models/RBAC/userModel")
const db = require("../../Utils/DB/db")
const jwt = require("jsonwebtoken")

const ProfileInfo = async (req, res) => {
    await db()
    try {
        const token = req.cookies[process.env.JWT_KEY]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        const FetchUserInfo = await LeadModel.findOne({ userId: decode.userId })
        if(FetchUserInfo){
            res.send({ success: true, data: FetchUserInfo })
        }
    }
    catch (err) {
        res.send({ success: false, message: err.message })
    }
}

const UpdateProfile = async (req, res) => {
    await db()
    const UpdateProfileData = req.body
    try {
        const FindUserInfo = await LeadModel.findOne({_id : UpdateProfileData._id})
        const FindUserProfile = await userModel.findById(FindUserInfo.userId)

        if(FindUserInfo && FindUserInfo) {
            FindUserInfo.name = UpdateProfileData.name || FindUserInfo.name
            FindUserInfo.rollNumber = UpdateProfileData.rollNumber || FindUserInfo.rollNumber
            FindUserInfo.branch = UpdateProfileData.branch || FindUserInfo.branch
            FindUserInfo.profileImg = UpdateProfileData.profileImg || FindUserInfo.profileImg
            FindUserInfo.gender = UpdateProfileData.gender || FindUserInfo.gender
            FindUserProfile.name = UpdateProfileData.name || FindUserProfile.name
            FindUserProfile.image = UpdateProfileData.profileImg || FindUserProfile.image
            await FindUserInfo.save()
            await FindUserProfile.save()
        }
    } 
    catch (err) {
        console.log(err)
        res.send({success : false , message : err.message})
    }
}
module.exports = { ProfileInfo , UpdateProfile } 