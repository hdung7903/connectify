const nodemailer = require('nodemailer');
require('dotenv').config();  // Make sure your .env is loaded

// Create a nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'magdalena74@ethereal.email',
      pass: 'gKHF7gkDczF2hXvx5A'
  }
});

// Export the transporter object
module.exports = transporter;