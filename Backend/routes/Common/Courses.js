const express = require('express');
const { Allcourses, SingleCourseView } = require('../../Controllers/Common/courses');
const router = express.Router()

router.get("/allcourses" , Allcourses)
router.get("/get/:id" , SingleCourseView)

module.exports = router 