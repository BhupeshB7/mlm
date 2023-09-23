const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-email', async (req, res) => {
  try {
    const {name, email, message} = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
      },
    });

    const mailOptions = {
      from: email,
      to:process.env.EMAIL,
      subject: 'New contact form submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
module.exports = router;