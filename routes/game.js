// routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Route to save game details
router.post('/saveGame', async (req, res) => {
  try {
    const {
      userId,
      entryFee,
      targetColor,
      chosenColor,
      result,
      winningAmount,
    } = req.body;

    const game = new Game({
      userId,
      entryFee,
      targetColor,
      chosenColor,
      result,
      winningAmount,
    });

    await game.save();

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
    const pageSize = 20; // Set the page size (items per page)

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

module.exports = router;
