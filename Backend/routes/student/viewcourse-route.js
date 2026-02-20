const express = require('express');
const {StudentViewCurrentCourse} = require("../../Controllers/student/viewcourse-controller");
const router = express.Router()



router.get("/viewcourse/:id", StudentViewCurrentCourse);


module.exports=router;
