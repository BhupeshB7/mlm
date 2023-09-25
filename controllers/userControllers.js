const GameProfile = require('../models/GameProfile');
const Image = require('../models/Image');
const User = require('../models/User');
const { generateUserId } = require('../utils/generateUserId');
const { hashPassword } = require('../utils/passwordUtils');
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, sponsorId } = req.body;

    // Check if sponsor ID exists
    // const sponsor = await User.findOne({ userId: sponsorId });
    // if (!sponsor) {
    //   return res.status(404).json({ error: 'Invalid sponsor ID' });
    // }


    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if mobile number already exists
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }

    // Generate user ID
    const userId = generateUserId();
      // Hash the password
      const hashedPassword = await hashPassword(req.body.password);
          
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      sponsorId,
      userId
    });

    // Save user to database
    await user.save();
    const game = new GameProfile({
      userId,
      name,
    });
    await game.save();
    const image = new Image({
      userId,
    });
    await image.save();
    res.json({ userId, name, password, sponsorId});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
