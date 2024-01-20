// routes/session.js
const express = require('express');
const Session = require('../models/Gift');
const cron = require('node-cron');

const router = express.Router();

function generateRandomCode() {
  const piPrefix = 'PI';
  const piDigits = 2;
  const randomPartLength = 6;

  // Generate random alphanumeric characters
  const randomPart = Math.random().toString(36).substring(2, 2 + randomPartLength).toUpperCase();

  return piPrefix + piDigits + randomPart;
}

function cleanupExpiredSessions() {
  const currentTime = new Date();
  const cleanupTime = new Date(currentTime.getTime() - 10 * 60000); // 10 minutes ago

  Session.deleteMany({ expirationTime: { $lte: cleanupTime } }, (err, result) => {
    if (err) {
      console.error('Error cleaning up expired sessions:', err);
    } else {
      console.log(`${result.deletedCount} sessions deleted within 10 minutes of expiration.`);
    }
  });
}

cron.schedule('* * * * *', cleanupExpiredSessions);

router.post('/generateCode', async (req, res) => {
  try {
    const { amount, giftTime } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount. Please provide a valid positive number.' });
    }

    if (!giftTime || isNaN(giftTime) || giftTime <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid giftTime. Please provide a valid positive number of minutes.' });
    }

    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + giftTime * 60000);

    const code = generateRandomCode();

    const session = new Session({
      amount,
      giftTime,
      code,
      expirationTime,
    });

    await session.save();

    res.json({
      success: true,
      code,
      expirationTime,
    });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });
  }
});

router.post('/checkCode', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required.' });
    }

    const session = await Session.findOne({ code });

    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found. Please check the code.' });
    }

    const currentTime = new Date();
    if (currentTime > session.expirationTime) {
      // Code is expired
      return res.status(404).json({ success: false, message: 'Code is expired.' });
    }

    // Code is valid, fetch the last amount and generate a random number
    const lastAmount = session.amount || 0;
    const randomNumber = Math.floor(Math.random() * (lastAmount + 1));

    res.json({
      success: true,
      message: 'Code is valid.',
      lastAmount,
      randomNumber,
    });
  } catch (error) {
    console.error('Error checking code:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });
  }
});

module.exports = router;
