const express = require('express');
const { GetOrderDetailes } = require('../../Controllers/instructor/Courses');
const router = express.Router()

router.get("/orders" , GetOrderDetailes)

module.exports = router