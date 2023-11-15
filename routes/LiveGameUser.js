const express = require('express');
const LiveGameData = require('../models/LiveGameData');
const router = express.Router();
// Route to save game details
router.post('/liveGame/saveGame', async (req, res) => {
    try {
      const {
        userId,
        entryFee,
        choosenColor,
        choosenLetter,
        ChoosenNumber,
      } = req.body;
  
      const game = new LiveGameData({
        userId,
        entryFee,
        choosenColor,
        choosenLetter,
        ChoosenNumber,
      });
  
      await game.save();
  
      res.status(201).json({ message: 'Game saved successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Define the endpoint to fetch all LiveGameUsers
router.get('/liveGameUsers', async (req, res) => {
  try {
    const liveGameUsers = await LiveGameData.find();
    res.json(liveGameUsers);
  } catch (error) {
    console.error('Error fetching live game users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports =router;