const express = require('express');
const { fetchAllTheInstructors, fetchTheInstructorsCourses } = require('../../Controllers/admin/instructors');
const router = express.Router()

router.get("/all" , fetchAllTheInstructors)
router.get("/oneuser/:id" , fetchTheInstructorsCourses)

module.exports = router