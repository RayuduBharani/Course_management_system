const express = require('express');
const { StudentProfileInfo, StdentUpdateProfile } = require('../../Controllers/student/profile-controller');
const router = express.Router()

router.get("/info" , StudentProfileInfo)
router.put("/update" , StdentUpdateProfile)

module.exports = router