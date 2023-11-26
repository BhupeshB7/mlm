const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const axios = require('axios');
const router = express.Router();

router.post("/login", async (req, res) => {
  const { userId, password, captchaResponse} = req.body;
 // Verify the captcha response with the captcha service's API
 const captchaSecretKey = '6LesDAkmAAAAADqvqEelZH_MGPpueFiN8q6PEmp1';
//  const captchaSecretKey = '6Lc1-wgmAAAAAFTFsy_Hkk_a33hV94dP1XNwTzig';
 const captchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${captchaSecretKey}&response=${captchaResponse}`;


  try {
    const response = await axios.post(captchaVerifyUrl);
    const { success } = response.data;
    if(success){
      
    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password!" });
    }

   
    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7h",
    });
    res.json({ token });
    }else{
       // Return an error response indicating invalid captcha
       res.status(401).json({ error: 'Invalid captcha' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/block/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/unblock/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
