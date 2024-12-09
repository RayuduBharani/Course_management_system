const express = require('express');
const { CreateOrder, CapturePayment } = require('../../Controllers/Orders/order-controllers');
const { StudentCreateModel, StudentCapturePayment } = require('../../Controllers/Orders/student/order-controller');
const router = express.Router()

router.post("/create" , CreateOrder)
router.post("/caputre" , CapturePayment)

router.post("/create/stu" , StudentCreateModel)
router.post("/caputre/stu" , StudentCapturePayment)

module.exports = router