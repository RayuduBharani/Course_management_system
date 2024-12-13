const mongoose = require('mongoose');
// 'mongodb+srv://Bharani_Rayudu:Bharani@cluster0.bsh0jfz.mongodb.net/CMS?retryWrites=true&w=majority&appName=Cluster0'
// mongodb://localhost:27017/CMS
const db = async () => {
    try {
        await mongoose.connect("mongodb+srv://Bharani_Rayudu:Bharani@cluster0.bsh0jfz.mongodb.net/CMS?retryWrites=true&w=majority&appName=Cluster0");
        console.log('MongoDB connected');
    } 
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
module.exports = db;