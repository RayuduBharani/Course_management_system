const express = require('express');
const { createWithdrawalRequest, getWithdrawalHistory } = require('../../Controllers/instructor/withdrawal-controller');
const router = express.Router();

router.post("/request", createWithdrawalRequest);
router.get("/history", getWithdrawalHistory);

module.exports = router;
