const nodemailer = require('nodemailer');
require('dotenv').config();  // Make sure your .env is loaded

// Create a nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',  // or another service like 'hotmail', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS   // Your email password or app password
    },
});

// Export the transporter object
module.exports = transporter;
