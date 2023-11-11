const express = require('express');
const LiveGameData = require('../models/LiveGameData');
const router = express.Router();
// Route to save game details
router.post('/saveGame', async (req, res) => {
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
module.exports =router;