const LeadCoursePurchaseModel = require("../../Models/Lead/PurchaseCourses")
const db = require("../../Utils/DB/db")


const ViewCurrentCourse = async (req, res) => {
    await db()
    const {id} = req.params
    // console.log(id)
    try {
        const leadCourses = await LeadCoursePurchaseModel.find({_id : id}).populate("leadId").populate("course.courseId");
        if(leadCourses){
            res.send({success : true , leadCourses : leadCourses})
        }
        else {
            res.send({success : false , message : "he is not purchasing any courses"})
        }
    }
    catch (err) {
        console.log("error " ,err)
        res.send({success : false , message : err.message})
    }
}

module.exports={ViewCurrentCourse};
