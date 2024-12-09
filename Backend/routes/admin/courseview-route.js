const express = require('express');

const {LeadCourseView, accessOrders} = require('../../Controllers/admin/courseAccess')


const router = express.Router()


router.get('/viewcourse/:id',LeadCourseView);
router.get('/orders',accessOrders);


module.exports = router;