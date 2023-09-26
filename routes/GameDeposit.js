const express = require("express");
const router = express.Router();
// server.js
// ...

const GameProfile = require("../models/GameProfile"); // Import the GameProfile model
const GameDeposit = require("../models/GameDeposit");
const GameWithdrawal = require("../models/GameWithdrawal");

// ...
// Endpoint for users to submit requests
router.post("/depositSubmit", async (req, res) => {
  try {
    const { name, amount, userId } = req.body;
    const userRequest = new GameDeposit({ name, amount, userId });
    await userRequest.save();
    res.json({ message: "Request submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Endpoint for admins to approve requests
router.put("/approve/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { amount } = req.body;
    const userRequest = await GameDeposit.findByIdAndUpdate(id, {
      approved: "Approved", // Set the status to 'Approved'
    });

    if (!userRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Fetch the user's profile by userId
    const userProfile = await GameProfile.findOne({
      userId: userRequest.userId,
    });
    console.log(userProfile);
    console.log(amount);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Check if amount is a valid number
    if (isNaN(amount)) {
      return res.status(400).json({ message: "Invalid amount value" });
    }

    // Update the balance in the user's profile (assuming userRequest.amount is the deposit amount)
    userProfile.balance += parseFloat(amount); // Convert amount to a number if it's a string
    await userProfile.save();

    res.json({ message: "Request approved and balance updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/withdrawalSubmit", async (req, res) => {
  try {
    const { name, amount, userId, UPI } = req.body;
    const check = await GameProfile.findOne({ userId: userId });
    if(!check){
        return res.status(404).json({ message: "UserId  not found" });
    }
    if(amount > check.totalwin){
        return res.status(401).json({ message: "Insufficient Balance" });
    }
    const userRequest = new GameWithdrawal({ name, amount, userId, UPI });
    await userRequest.save();
    check.totalwin -= amount;
    await check.save();
    res.json({ message: "Withdrawal submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/history/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Assuming you have a Game model, you can use it to query the database
      const gameHistory = await GameWithdrawal.find({ userId: userId });
      res.json(gameHistory);
    } catch (err) {
      console.error(`Error fetching game history: ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Define a page and pageSize in your route

// router.get('/history/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const page = parseInt(req.query.page) || 1; // Get the page from the query parameters or default to 1
//     const pageSize = 20; // Set the page size (items per page)

//     // Calculate the number of documents to skip based on the page and pageSize
//     const skip = (page - 1) * pageSize;

//     // Assuming you have a GameWithdrawal model, you can use it to query the database with skip and limit
//     const totalCount = await GameWithdrawal.countDocuments({ userId: userId });

//     const totalPages = Math.ceil(totalCount / pageSize);

//     const gameHistory = await GameWithdrawal.find({ userId: userId })
//       .skip(skip)
//       .limit(pageSize)
//       .sort({ createdAt: -1 });

//     // Include page and itemsPerPage in the response
//     res.json({
//       page,
//       itemsPerPage: pageSize,
//       totalPages,
//       gameHistory,
//     });
//   } catch (err) {
//     console.error(`Error fetching game history: ${err}`);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


  router.get('/deposit/history/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Assuming you have a Game model, you can use it to query the database
      const gameHistory = await GameDeposit.find({ userId: userId });
      res.json(gameHistory);
    } catch (err) {
      console.error(`Error fetching game history: ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// ...

module.exports = router;
