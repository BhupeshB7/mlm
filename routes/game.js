// routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const GameProfile = require('../models/GameProfile');
const User = require('../models/User');

// Route to save game details
router.post('/saveGame', async (req, res) => {
  try {
    const {
      userId,
      entryFee,
      targetColor,
      targetLetter,
      chosenColor,
      result,
    } = req.body;

    const game = new Game({
      userId,
      entryFee,
      targetColor,
      chosenColor,
      targetLetter,
      result,
    });

    await game.save();
    const level1 =  await GameProfile.findOne({sponsorId: userId});
    if(level1){
      level1.balance += entryFee*0.006;
      level1.levelIncome += entryFee*0.006;
    }
    res.status(201).json({ message: 'Game saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// router.get('/history/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // Assuming you have a Game model, you can use it to query the database
//     const gameHistory = await Game.find({ userId: userId });
//     res.json(gameHistory);
//   } catch (err) {
//     console.error(`Error fetching game history: ${err}`);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// Modify the route to fetch all user data based on email

router.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1; // Get the page from the query parameters or default to 1
    const pageSize = 10; // Set the page size (items per page)

    // Calculate the number of documents to skip based on the page and pageSize
    const skip = (page - 1) * pageSize;

    // Assuming you have a GameWithdrawal model, you can use it to query the database with skip and limit
    const totalCount = await Game.countDocuments({ userId: userId });

    const totalPages = Math.ceil(totalCount / pageSize);

    const gameHistory = await Game.find({ userId: userId })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

     // Include page and itemsPerPage in the response
    res.json({
      page,
      itemsPerPage: pageSize,
      totalPages,
      gameHistory,
    });
  } catch (err) {
    console.error(`Error fetching game history: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/gamer/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Assuming you have a User model that stores user data including the winning amount
    const user = await Game.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(`Error fetching user data: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// User balace update
router.get('/balance/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ userId });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/balance/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { balance } = req.body;

    const user = await User.findOneAndUpdate({ userId }, { $set: { balance } }, { new: true });

    if (user) {
      res.json({message: 'Balance updated successfully'});
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/winningGame/user', async (req, res) => {
  console.log('Incoming Request:', req.body);
  const { userId, winnings } = req.body;

  try {
    // Fetch the user's profile by userId
    const userProfile = await GameProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: 'User Game profile not found' });
    }

      // Increase  the winnings fee in the winnings
      userProfile.totalwin += winnings;

      // Save the updated user profile
      await userProfile.save();

      // Return the updated user profile with the new balance
      return res.json({ totalwin: userProfile.totalwin });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
