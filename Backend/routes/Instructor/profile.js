const express = require('express');
const { instructorProfile, updateProfile } = require('../../Controllers/instructor/profile');
const router = express.Router()

router.get("/view" , instructorProfile)
router.put("/update" , updateProfile)

module.exports = router