const express = require('express');
const router = express.Router();
const User = require('../models/User');

// API endpoint to handle the transfer
// router.post('/transferTopupWallet', async (req, res) => {
//   const { sourceUserId, targetUserId, amount } = req.body;

//   // Check if the source user exists and has sufficient balance
//   const sourceUser = await User.findOne({ userId: sourceUserId });
//   if (!sourceUser) {
//     return res.status(400).json({ error: 'Source user not found' });
//   }
//   if (sourceUser.topupWallet < amount || amount < 200) {
//     return res.status(400).json({ error: 'Insufficient balance or invalid transfer amount' });
//   }

//   // Check if the target user exists
//   const targetUser = await User.findOne({ userId: targetUserId });
//   if (!targetUser) {
//     return res.status(400).json({ error: 'UserID not found' });
//   }

//   // Update the source user's topupWallet
//   sourceUser.topupWallet -= amount;
//   await sourceUser.save();

//   // Update the target user's topupWallet
//   targetUser.topupWallet += amount;
//   await targetUser.save();

//   res.json({ message: 'Transfer successful' });
// });
const mongoose = require('mongoose');
const TopUpHistory = require('../models/TopUpHistory');

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

  // Create a new TopupHistory record
  const topupHistory = new TopUpHistory({
    name: sourceUser.name,
    userId: sourceUserId,
    targetUserId: targetUserId,
    amount: amount,
  });

  // Save the top-up history record
  await topupHistory.save();

  res.json({ message: 'Transfer successful' });
});

// Modify the route to return just the user's name
router.get('/targetTransfer/name/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ userId });
    if (user) {
      res.json({ name: user.name });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
