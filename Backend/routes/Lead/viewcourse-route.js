const express = require('express');
// const { ProfileInfo, UpdateProfile } = require('../../Controllers/Lead/Profile-controller');\
const {ViewCurrentCourse} = require("../../Controllers/Lead/viewcourse-controller");
const router = express.Router()



router.get("/viewcourse/:id", ViewCurrentCourse);


module.exports=router;
