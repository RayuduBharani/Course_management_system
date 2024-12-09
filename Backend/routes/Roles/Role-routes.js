const express = require('express');
const { InstructureRole, TeamLeadRole, StudentRole } = require('../../Controllers/Roles/Role-controller');
const router = express.Router()

router.post("/instructor" , InstructureRole)
router.post("/lead" , TeamLeadRole)
router.post('/student' , StudentRole)

module.exports = router