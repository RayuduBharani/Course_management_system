const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    userEmail: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["Pending", "Approval", "Rejected"]
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    paymentId: {
        type: String,
    },
    payerId: {
        type: String,
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructors",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        required: true,
    },
    courseTitle: {
        type: String,
        required: true,
    },
    coursePrice: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    }
} , { timestamps: true })

const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel