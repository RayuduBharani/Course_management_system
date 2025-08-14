const express = require('express');
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth/auth-router");
const RoleRouter = require('./routes/Roles/Role-routes');
const CourseRouter = require("./routes/Instructor/Courses")
const AllCourseRouter = require("./routes/Common/Courses")
const LeadOrderRouter = require('./routes/Orders/Order-route');
const LeadCoursesRouter = require('./routes/Lead/mycourse-route');
const ProfileRouter = require("./routes/Lead/profile-route")
const viewcourseRouter = require("./routes/Lead/viewcourse-route")
const studentViewcourseRouter = require("./routes/student/viewcourse-route")
const adminViewCourse = require('./routes/admin/courseview-route')
const TeamMembers = require("./routes/Lead/team-allocation-route")
const StudentCoursesROuter = require("./routes/student/mycourses-route")
const StudentProfileRouter = require("./routes/student/profile-route")
const AdminCourseAccessRouter = require("./routes/admin/courseAccess-route")
const InstrctorProfile = require("./routes/Instructor/profile")
const InstrctorEarnings = require("./routes/Instructor/earnings")
const Instrctordetailes = require("./routes/admin/instructor-route")
const InstructorWithdrawal = require("./routes/Instructor/withdrawal-route")
const AdminWithdrawalRouter = require("./routes/admin/withdrawal-route")

const app = express();
app.use(express.json())

app.use(cors({
    origin: ['http://localhost:5173',"http://localhost:4173" , "https://course-management-system-1-a96d.onrender.com" , "https://cms-bharani.vercel.app" , "https://cms4.vercel.app"], // or whatever port your Vite frontend runs on
    credentials: true
}));

app.use(cookieParser())
app.get("/", (req, res) => {
    res.send({ success: true, message: "It's Working" })
})

// auth
app.use("/api/auth", authRouter)

//RBAC
app.use('/api/check-verify', RoleRouter)

// instructor 
app.use('/instructor/course', CourseRouter)
app.use("/instructor/profile" , InstrctorProfile)
app.use("/instructor/earning" , InstrctorEarnings)
app.use("/instructor/withdrawal", InstructorWithdrawal)

// admin
app.use("/admin", AdminWithdrawalRouter)

// All Courses
app.use("/courses", AllCourseRouter)

// orderCourses 
app.use('/order', LeadOrderRouter)  // Changed from /lead/order to /order for consistency

// lead 
app.use("/lead/mycourse", LeadCoursesRouter)
app.use("/lead/profile", ProfileRouter)
app.use("/lead/progress-page", viewcourseRouter)
app.use("/lead/team", TeamMembers)

// student 
app.use("/student/mycourse", StudentCoursesROuter)
app.use("/student/profile", StudentProfileRouter)
app.use("/student/progress-page",studentViewcourseRouter);
// admin 
app.use("/admin/course", AdminCourseAccessRouter)
app.use("/admin/course",adminViewCourse);
app.use("/admin/instructor" , Instrctordetailes)

app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
    console.log(`Server running on http://localhost/${process.env.PORT || 8000}`);
})
