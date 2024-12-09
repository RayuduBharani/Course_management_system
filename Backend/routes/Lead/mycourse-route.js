const express = require('express');
const { GetMyCourse, SearchCourses } = require('../../Controllers/Lead/mycourse-controller');
const router = express.Router()

router.get("/all" , GetMyCourse)
router.get("/search/:name" , SearchCourses)

module.exports = router