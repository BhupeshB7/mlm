// routes.js

const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Image = require('../models/CloudImage');

const router = express.Router();

// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image to Cloudinary and store its data in MongoDB
router.post('/deposit/upload', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
    });

    const newImage = new Image({
      public_id: result.public_id,
      url: result.secure_url,
    });

    await newImage.save();

    res.json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Fetch images from MongoDB
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
