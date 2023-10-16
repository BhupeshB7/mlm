const express = require('express');
const router = express.Router();
const User = require('../models/User');

// API endpoint to handle the transfer
router.post('/transferTopupWallet', async (req, res) => {
  const { sourceUserId, targetUserId, amount } = req.body;

  // Check if the source user exists and has sufficient balance
  const sourceUser = await User.findOne({ userId: sourceUserId });
  if (!sourceUser) {
    return res.status(400).json({ error: 'Source user not found' });
  }
  if (sourceUser.topupWallet < amount || amount < 200) {
    return res.status(400).json({ error: 'Insufficient balance or invalid transfer amount' });
  }

  // Check if the target user exists
  const targetUser = await User.findOne({ userId: targetUserId });
  if (!targetUser) {
    return res.status(400).json({ error: 'UserID not found' });
  }

  // Update the source user's topupWallet
  sourceUser.topupWallet -= amount;
  await sourceUser.save();

  // Update the target user's topupWallet
  targetUser.topupWallet += amount;
  await targetUser.save();

  res.json({ message: 'Transfer successful' });
});

module.exports = router;
