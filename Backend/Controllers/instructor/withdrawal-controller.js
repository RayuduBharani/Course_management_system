const db = require("../../Utils/DB/db");
const jwt = require('jsonwebtoken');
const WithdrawalRequestModel = require("../../Models/Instructor/WithdrawalRequest");
const InstructorModel = require("../../Models/RBAC/InstructorModel");
const OrderModel = require("../../Models/Common/OrderModel");
const { COOKIE_NAME } = require("../auth/Auth-controller");

const JWT_SECRET = process.env.JWT_SECRET;

const createWithdrawalRequest = async (req, res) => {
    await db();
    try {
        const { amount, remarks } = req.body;
        const token = req.cookies[COOKIE_NAME];
        const decode = jwt.verify(token, JWT_SECRET);

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid withdrawal amount"
            });
        }

        // Validate minimum withdrawal amount (500 INR)
        if (numAmount < 500) {
            return res.status(400).json({
                success: false,
                message: "Minimum withdrawal amount is ₹500"
            });
        }

        const instructor = await InstructorModel.findOne({ userId: decode.userId });
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        // Check if there are any pending requests
        const pendingRequest = await WithdrawalRequestModel.findOne({
            instructorId: instructor._id,
            status: 'pending'        });

        if (pendingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending withdrawal request"
            });
        }

        // Calculate total earnings from approved orders
        const orders = await OrderModel.find({
            instructorId: instructor._id,
            orderStatus: "Approved"
        });

        const totalEarnings = orders.reduce((sum, order) => 
            sum + (Number(order.coursePrice) || 0), 0
        );

        // Calculate already withdrawn amount
        const approvedWithdrawals = await WithdrawalRequestModel.find({
            instructorId: instructor._id,
            status: 'approved'
        });

        const totalWithdrawn = approvedWithdrawals.reduce((sum, withdrawal) => 
            sum + withdrawal.amount, 0
        );

        const availableBalance = totalEarnings - totalWithdrawn;        if (numAmount > availableBalance) {
            return res.status(400).json({
                success: false,
                message: "Withdrawal amount cannot be greater than available balance"
            });
        }

        // Validate instructor UPI ID exists
        if (!instructor.UPI) {
            return res.status(400).json({
                success: false,
                message: "Please update your UPI ID in profile settings before requesting withdrawal"
            });
        }

        const newWithdrawalRequest = new WithdrawalRequestModel({
            instructorId: instructor._id,
            amount: numAmount,
            upiId: instructor.UPI,
            remarks
        });

        await newWithdrawalRequest.save();

        res.status(200).json({
            success: true,
            message: "Withdrawal request created successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || "An error occurred while creating the withdrawal request"
        });
    }
};

const getWithdrawalHistory = async (req, res) => {
    await db();
    try {
        const token = req.cookies[COOKIE_NAME];
        const decode = jwt.verify(token, JWT_SECRET);
        
        const instructor = await InstructorModel.findOne({ userId: decode.userId });
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found"
            });
        }

        const withdrawals = await WithdrawalRequestModel.find({
            instructorId: instructor._id
        }).sort({ createdAt: -1 });

        // Calculate total withdrawn amount
        const totalWithdrawn = withdrawals
            .filter(w => w.status === 'approved')
            .reduce((sum, w) => sum + w.amount, 0);

        // Get total earnings
        const orders = await OrderModel.find({
            instructorId: instructor._id,
            orderStatus: "Approved"
        });

        const totalEarnings = orders.reduce((sum, order) => 
            sum + (Number(order.coursePrice) || 0), 0
        );

        // Calculate available balance
        const availableBalance = totalEarnings - totalWithdrawn;

        res.status(200).json({
            success: true,
            withdrawals,
            totalWithdrawn,
            totalEarnings,
            availableBalance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { createWithdrawalRequest, getWithdrawalHistory };
