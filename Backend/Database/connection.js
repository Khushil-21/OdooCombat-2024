const mongoose = require('mongoose');

const uri = "mongodb+srv://shahkhushil2105:G6YwRA9ahcBmN3VP@odoofurniturerental.4sp7xyx.mongodb.net/FurnitureRental";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(uri);
        console.log("Connection successful");
        return conn;
    } catch (error) {
        console.error("Connection failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;
