const express = require('express');
const LiveGameData = require('../models/LiveGameData');
const LivePredict = require('../models/LivePredict');
const LiveGameHistory = require('../models/LiveGameHistory');
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
router.get('/liveGameHistory', async (req, res) => {
  try {
    const liveGameUsers = await LiveGameHistory.find();
    res.json(liveGameUsers);
  } catch (error) {
    console.error('Error fetching live game users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/saveSelection', async (req, res) => {
  try {
    const { sessionId, color, number, size } = req.body;

    const newSelection = new LivePredict({
      sessionId,
      color,
      number,
      size,
    });
    const newHistory = new LiveGameHistory({
      sessionId,
      color,
      number,
      size,
    });
    await newHistory.save();
    await newSelection.save();
    res.status(200).json({message:'Successfully saved'});
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

module.exports =router;