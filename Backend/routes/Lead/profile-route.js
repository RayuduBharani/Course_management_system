const express = require('express');
const { ProfileInfo, UpdateProfile } = require('../../Controllers/Lead/Profile-controller');
const router = express.Router()

router.get("/info" , ProfileInfo)
router.put("/update" , UpdateProfile)

module.exports = router