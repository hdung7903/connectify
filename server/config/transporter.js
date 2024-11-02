const nodemailer = require('nodemailer');
require('dotenv').config();  // Make sure your .env is loaded

// Create a nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Export the transporter object
module.exports = transporter;