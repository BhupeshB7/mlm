const express = require("express");
const LiveGameData = require("../models/LiveGameData");
const LivePredict = require("../models/LivePredict");
const LiveGameHistory = require("../models/LiveGameHistory");
const GameProfile = require("../models/GameProfile");
const router = express.Router();
// Route to save game details
router.post("/liveGame/saveGame", async (req, res) => {
  try {
    const { userId, entryFee, choosenColor, choosenLetter, choosenNumber } =
      req.body;

    const game = new LiveGameData({
      userId,
      entryFee,
      choosenColor,
      choosenLetter,
      choosenNumber,
    });

    await game.save();

    res.status(201).json({ message: "Game saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Define the endpoint to fetch all LiveGameUsers
router.get("/liveGameUsers", async (req, res) => {
  try {
    const liveGameUsers = await LiveGameData.find();
    res.json(liveGameUsers);
  } catch (error) {
    console.error("Error fetching live game users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Backend Route
// router.get("/liveGameHistory", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const perPage = parseInt(req.query.perPage) || 10;

//     const totalRecords = await LiveGameHistory.countDocuments();
//     const totalPages = Math.ceil(totalRecords / perPage);

//     const liveGameUsers = await LiveGameHistory.find()
//       .skip((page - 1) * perPage)
//       .limit(perPage);

//     res.json({
//       data: liveGameUsers,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error("Error fetching live game users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.get("/liveGameHistory", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const totalRecords = await LiveGameHistory.countDocuments();
    const totalPages = Math.ceil(totalRecords / perPage);

    const liveGameUsers = await LiveGameHistory.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const colorCounts = {};
    const sizeCounts = {};

    liveGameUsers.forEach((user) => {
      // Convert color and size to lowercase for case-insensitivity
      const lowerCaseColor = user.color.toLowerCase();
      const lowerCaseSize = user.size.toLowerCase();

      // Count colors
      colorCounts[lowerCaseColor] = (colorCounts[lowerCaseColor] || 0) + 1;

      // Count sizes
      sizeCounts[lowerCaseSize] = (sizeCounts[lowerCaseSize] || 0) + 1;
    });

    // Count specific colors (red, green, blueviolet)
    const redCount = colorCounts['red'] || 0;
    const greenCount = colorCounts['green'] || 0;
    const blueVioletCount = colorCounts['blueviolet'] || 0;

    // Count specific sizes (big, small)
    const bigCount = sizeCounts['big'] || 0;
    const smallCount = sizeCounts['small'] || 0;

    res.json({
      data: liveGameUsers,
      totalPages,
      currentPage: page,
      colorCounts,
      sizeCounts,
      redCount,
      greenCount,
      blueVioletCount,
      bigCount,
      smallCount,
    });
  } catch (error) {
    console.error("Error fetching live game users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Endpoint to check color and number match
router.post("/saveSelection", async (req, res) => {
  const {sessionId, color, number, size } = req.body;

  try {
     // Save the new selection in PredictLiveHistory model
     const newSelection = new LivePredict({
      sessionId,
      color,
      number,
      size,
    });
    await newSelection.save();

    // Save the new selection in LiveGameHistory model
    const newHistory = new LiveGameHistory({
      sessionId,
      color,
      number,
      size,
    });
    await newHistory.save();

    // Check color match
    const colorMatches = await LiveGameData.find({ choosenColor: color });
    if (colorMatches.length > 0) {
      const colorUpdatePromises = colorMatches.map(async (match) => {
        const { userId, entryFee } = match;
        const updatedBalance = entryFee * 1.5;
        await GameProfile.findOneAndUpdate(
          { userId },
          { $inc: { balance: updatedBalance } }
        );
      });
      await Promise.all(colorUpdatePromises);
    }
    // Check color match
    const sizeMatches = await LiveGameData.find({ choosenLetter: size });
    if (sizeMatches.length > 0) {
      const sizeUpdatePromises = sizeMatches.map(async (match) => {
        const { userId, entryFee } = match;
        const updatedBalance = entryFee * 1.5;
        await GameProfile.findOneAndUpdate(
          { userId },
          { $inc: { balance: updatedBalance } }
        );
      });
      await Promise.all(sizeUpdatePromises);
    }
    // Check number match
    const numberMatches = await LiveGameData.find({ choosenNumber: number });
    if (numberMatches.length > 0) {
      const numberUpdatePromises = numberMatches.map(async (match) => {
        const { userId, entryFee } = match;
        const updatedBalance = entryFee * 2;
        await GameProfile.findOneAndUpdate(
          { userId },
          { $inc: { balance: updatedBalance } }
        );
      });
      await Promise.all(numberUpdatePromises);
    }

    console.log('Matches checked, balances updated!');
    await LiveGameData.deleteMany({});
    return res.json({
      success: true,
      message: "Game Saved SuccessFully!",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
