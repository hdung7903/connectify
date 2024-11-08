const nodemailer = require('nodemailer');
require('dotenv').config(); 

// Create a nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'cruz.rolfson88@ethereal.email',
      pass: 'BXZ7g6wBE17wyAcDB3'
  }
});

module.exports = transporter;