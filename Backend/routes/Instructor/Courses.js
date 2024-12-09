const express = require('express');
const { AddCourse, GetInstructorCourses } = require('../../Controllers/instructor/Courses');
const router = express.Router()

router.post("/add" , AddCourse)
router.get("/get" , GetInstructorCourses)


module.exports = router