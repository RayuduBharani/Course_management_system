const express = require('express');
const { GetMyCourse, SearchCourses } = require('../../Controllers/student/mycourse-controller');
const router = express()


router.get("/all" , GetMyCourse)
router.get("/search/:name" , SearchCourses)

module.exports = router