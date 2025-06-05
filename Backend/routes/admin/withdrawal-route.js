const express = require('express');
const { getAllWithdrawalRequests, processWithdrawalRequest } = require('../../Controllers/admin/withdrawal-controller');
const router = express.Router();

router.get("/withdrawals", getAllWithdrawalRequests);
router.put("/withdrawals/:requestId", processWithdrawalRequest);

module.exports = router;
