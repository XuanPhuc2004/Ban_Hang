const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // App password generated from Google
    },
  });

  // Email details
  const mailOptions = {
    from: "phucvinhff2004@gmail.com", // Sender's email address
    to: email,
    subject: subject, // Subject of the email
    html: html, // Email content
  };
  
  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error occurred:", err);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};
