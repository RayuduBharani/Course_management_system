const mongoose = require('mongoose');

const StudentCoursePurchaseSchema = new mongoose.Schema({
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "students" ,
        required : true
    },
    course : [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "courses",
                required: true
            },
            DateOfPurchase: {
                type: Date,
                default: Date.now
            },
            instructorId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Instructors",
                required: true
            },
            paid : {
                required : true ,
                type : Number,
                min : 0
            }
        }
    ]
} , {timestamps : true})

StudentCoursePurchaseSchema.index({ studentId: 1 });

const StudentCoursePurchaseModel = mongoose.model("studentCourses" , StudentCoursePurchaseSchema)

module.exports = StudentCoursePurchaseModel