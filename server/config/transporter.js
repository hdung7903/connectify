const nodemailer = require('nodemailer');
require('dotenv').config();  // Make sure your .env is loaded

// Create a nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ce6b7ed3d817c8",
    pass: "0359a58f5508c8"
  }
});

// Export the transporter object
module.exports = transporter;


// Looking to send emails in production? Check out our Email API/SMTP product!
// var transport = nodemailer.createTransport({
 
// });