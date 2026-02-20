const LeadCoursePurchaseModel = require("../../Models/Lead/PurchaseCourses")
const db = require("../../Utils/DB/db")


const ViewCurrentCourse = async (req, res) => {
    await db()
    const {id} = req.params
    try {
        const leadCourses = await LeadCoursePurchaseModel.find({_id : id}).populate("leadId").populate("course.courseId");
        if(leadCourses && leadCourses.length > 0){
            res.status(200).json({success : true , leadCourses : leadCourses})
        }
        else {
            res.status(404).json({success : false , message : "Course not found"})
        }
    }
    catch (err) {
        res.status(500).json({success : false , message : err.message})
    }
}

module.exports={ViewCurrentCourse};
