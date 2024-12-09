const express = require('express');
const { TeamAllocation } = require('../../Controllers/Lead/Team-allocations');
const router = express.Router()

router.get("/members" , TeamAllocation)
module.exports = router