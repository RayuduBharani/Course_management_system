const mongoose = require('mongoose');

const LeadCoursePurchaseSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leaders",
        required: true
    },
    course: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "courses",
                required: true
            },
            courseTitle: {
                type: String,
                required: true,
            },
            DateOfPurchase: {
                type: Date,
                default: Date.now
            },
            instructorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Instructors",
                required: true
            },
            paid: {
                required: true,
                type: Number,
                min: 0
            }
        }
    ]
}, { timestamps: true })

LeadCoursePurchaseSchema.index({ leadId: 1 });

const LeadCoursePurchaseModel = mongoose.model("leadCourses", LeadCoursePurchaseSchema)
module.exports = LeadCoursePurchaseModel