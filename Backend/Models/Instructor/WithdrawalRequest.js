const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructors",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    upiId: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

const WithdrawalRequestModel = mongoose.model("withdrawalRequests", withdrawalRequestSchema);
module.exports = WithdrawalRequestModel;
