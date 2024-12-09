const express = require('express');
// const { ProfileInfo, UpdateProfile } = require('../../Controllers/Lead/Profile-controller');\
const {StudentViewCurrentCourse} = require("../../Controllers/student/viewcourse-controller");
const router = express.Router()



router.get("/viewcourse/:id", StudentViewCurrentCourse);


module.exports=router;
