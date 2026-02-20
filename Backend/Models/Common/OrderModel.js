const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    userEmail: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["Pending", "Approved", "Rejected"]
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
        type: Number,
        required: true,
        min: 0
    }
} , { timestamps: true })

OrderSchema.index({ userId: 1 });
OrderSchema.index({ instructorId: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ userId: 1, courseId: 1 });

const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel