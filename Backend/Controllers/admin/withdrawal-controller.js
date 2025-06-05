const db = require("../../Utils/DB/db");
const WithdrawalRequestModel = require("../../Models/Instructor/WithdrawalRequest");

const getAllWithdrawalRequests = async (req, res) => {
    await db();
    try {
        const withdrawals = await WithdrawalRequestModel.find()
            .populate("instructorId", "name email UPI")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            withdrawals
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const processWithdrawalRequest = async (req, res) => {
    await db();
    try {
        const { requestId } = req.params;
        const { status, remarks } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be either 'approved' or 'rejected'"
            });
        }

        const withdrawalRequest = await WithdrawalRequestModel.findById(requestId);
        if (!withdrawalRequest) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal request not found"
            });
        }

        withdrawalRequest.status = status;
        if (remarks) {
            withdrawalRequest.remarks = remarks;
        }

        await withdrawalRequest.save();

        res.status(200).json({
            success: true,
            message: `Withdrawal request ${status} successfully`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { getAllWithdrawalRequests, processWithdrawalRequest };
