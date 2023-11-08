const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// Create a notice
router.post('/v1', async (req, res) => {
  try {
    const newNotice = new Notice(req.body);
    const savedNotice = await newNotice.save();
    res.json(savedNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notices
router.get('/notice', async (req, res) => {
  try {
    const notices = await Notice.find().sort('-timestamp');
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a notice by ID
router.delete('/notice/:id', async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndRemove(req.params.id);
    if (!deletedNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json(deletedNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
