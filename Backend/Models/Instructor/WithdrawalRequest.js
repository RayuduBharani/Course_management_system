const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructors",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [500, 'Minimum withdrawal amount is ₹500']
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
        type: String,
        maxlength: 500
    },
    processedAt: {
        type: Date
    }
}, { timestamps: true });

withdrawalRequestSchema.index({ instructorId: 1 });
withdrawalRequestSchema.index({ status: 1 });

const WithdrawalRequestModel = mongoose.model("withdrawalRequests", withdrawalRequestSchema);
module.exports = WithdrawalRequestModel;
