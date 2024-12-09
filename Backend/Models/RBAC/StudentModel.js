const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    gender : {
        type : String ,
        required : true
    },
    branch: {
        type: String,
        required: true,
    },
    teamNum: {
        type: String,
        enum: [
            "Team-1", "Team-2", "Team-3", "Team-4", "Team-5",
            "Team-6", "Team-7", "Team-8", "Team-9", "Team-10"
        ],
        required: true
    },
    profileImg: {
        type: String,
        default: "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
    },
    role: {
        type: String,
        enum: ["Admin", "Instructor", "Lead", "Student", "Empty"],
        default: "Student"
    },
    enrolledCourses: [
        {
            coursesId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "studentCourses"
            }
        }
    ]
} , {timestamps : true});

const StudentModel = mongoose.model("students", StudentSchema);
module.exports = StudentModel;