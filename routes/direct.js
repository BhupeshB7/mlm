
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/direct/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId: userId }).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sponsor = await User.find({ sponsorId: user.userId });

    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }

    res.status(200).json(sponsor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
