const LeadModel = require("../../Models/RBAC/LeadModel");
const StudentModel = require("../../Models/RBAC/StudentModel");
const db = require("../../Utils/DB/db");
const jwt = require("jsonwebtoken");

const sendMessageToTeamMember = async (req, res) => {
    await db();
    try {
        const { memberId } = req.params;
        const { message } = req.body;
        
        // Verify the lead
        const token = req.cookies[process.env.JWT_KEY];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        const findLead = await LeadModel.findOne({ userId: decode.userId });
        
        if (!findLead) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized access" 
            });
        }

        // Find the team member
        const teamMember = await StudentModel.findById(memberId);
        
        if (!teamMember) {
            return res.status(404).json({ 
                success: false, 
                message: "Team member not found" 
            });
        }

        // Verify if the student is in the lead's team
        if (teamMember.teamNum !== findLead.teamNo) {
            return res.status(403).json({ 
                success: false, 
                message: "You can only message members of your team" 
            });
        }

        // Here you would typically:
        // 1. Save the message to a messages collection
        // 2. Send an email notification
        // 3. Create a notification in the app
        // For now, we'll just simulate success

        res.json({ 
            success: true, 
            message: "Message sent successfully",
            data: {
                from: findLead.name,
                to: teamMember.name,
                message,
                timestamp: new Date()
            }
        });

    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ 
            success: false, 
            message: err.message || "Failed to send message" 
        });
    }
};

module.exports = { sendMessageToTeamMember };
