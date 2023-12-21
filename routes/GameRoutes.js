// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/GameProfileController');
const GameProfile = require('../models/GameProfile');
const cron = require('node-cron');
// Define routes for CRUD operations
router.get('/:gameProfileId', profileController.getProfile);

// Route to start the game and deduct the entry fee
router.post('/startGame', async (req, res) => {
  const { userId, entryFee } = req.body;

  try {
    // Fetch the user's profile by userId
    const userProfile = await GameProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Check if the user's balance is sufficient
    if (userProfile.balance >= entryFee) {
      // Deduct the entry fee from the balance
      userProfile.balance -= entryFee;

      // Save the updated user profile
      await userProfile.save();

      // Return the updated user profile with the new balance
      return res.json({ balance: userProfile.balance });
    } else {
      return res.status(400).json({ message: 'Insufficient balance to play' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Schedule daily income reset using cron
// cron.schedule('46 14 * * *', async () => {
//   try {
//     // Reset dailyIncome for all users
//     await GameProfile.updateMany({}, { $set: { totalwin: 0 } });
//     console.log('Daily income reset successful for incomeWallet of game profile');
//   } catch (error) {
//     console.error('Error resetting daily income:', error);
//   }
// }, {
//   timezone: 'Asia/Kolkata', // Set the timezone to IST
// });
module.exports = router;
