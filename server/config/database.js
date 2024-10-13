require('dotenv').config(); // To load environment variables from .env file
const mongoose = require('mongoose');

// Mongoose connection setup
const connectDB = async () => {
    try {
        // Connecting to MongoDB (no options needed for the latest MongoDB driver)
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit with failure code
    }
};

module.exports = connectDB;
