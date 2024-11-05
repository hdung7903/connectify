const nodemailer = require('nodemailer');
require('dotenv').config(); 

// Create a nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'triston.wintheiser@ethereal.email',
      pass: 'yfEfnqqj6eFrvkq9Kx'
  }
});

module.exports = transporter;