const mongoose = require('mongoose');
require('dotenv').config();

// 'mongodb+srv://Bharani_Rayudu:Bharani@cluster0.bsh0jfz.mongodb.net/CMS?retryWrites=true&w=majority&appName=Cluster0'
// mongodb://localhost:27017/CMS
const db = async () => {    
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } 
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
module.exports = db;