// // API endpoint (api.js)
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // Calculate daily level income for a user
// router.get('/daily-level-income/users/:id', async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Calculate daily level income
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     const dailyIncome = user.income - user.yesterdayAmount || 0;

//     // Update the user's yesterdayAmount with today's value
//     user.yesterdayAmount = user.income;
//     user.save();

//     return res.json({ dailyIncome, totalIncome: user.income });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;



// API endpoint (api.js)
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Calculate daily level income for a user
// router.get('/daily-level-income/users/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await User.findOne({userId: userId});

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Calculate daily level income
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     let dailyIncome = 0;

//     // Check if income was updated today
//     if (
//       user.incomeLastUpdated &&
//       user.incomeLastUpdated.getFullYear() === today.getFullYear() &&
//       user.incomeLastUpdated.getMonth() === today.getMonth() &&
//       user.incomeLastUpdated.getDate() === today.getDate()
//     ) {
//       dailyIncome = user.income - user.yesterdayAmount;
//     } else if (
//       user.incomeLastUpdated &&
//       user.incomeLastUpdated.getFullYear() === yesterday.getFullYear() &&
//       user.incomeLastUpdated.getMonth() === yesterday.getMonth() &&
//       user.incomeLastUpdated.getDate() === yesterday.getDate()
//     ) {
//       dailyIncome = user.income - user.yesterdayAmount;
//       user.yesterdayAmount = user.income;
//       user.incomeLastUpdated = today;
//       await user.save();
//     }

//     return res.json({ dailyIncome, totalIncome: user.income });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
//latest code
// router.get('/daily-level-income/users/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const user = await User.findOne({ userId: userId });

//     // Check if the user exists
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Calculate daily level income
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     let dailyIncome = 0; // Set default to userIncome - yesterdayIncome

//     // Check if income was updated today
//     if (
//       user.incomeLastUpdated &&
//       user.incomeLastUpdated.getFullYear() === today.getFullYear() &&
//       user.incomeLastUpdated.getMonth() === today.getMonth() &&
//       user.incomeLastUpdated.getDate() === today.getDate()
//     ) {
//       dailyIncome = user.income - user.yesterdayAmount;
//     } else {
//       // Calculate the number of days between the last income update and today
//       const daysSinceLastUpdate = Math.floor(
//         (today.getTime() - user.incomeLastUpdated.getTime()) / (1000 * 60 * 60 * 24)
//       );

//       if (daysSinceLastUpdate === 1) {
//         // If the last update was yesterday, update the yesterdayAmount and incomeLastUpdated fields
//         dailyIncome = user.income - user.yesterdayAmount;
//         user.yesterdayAmount = user.income;
//         user.incomeLastUpdated = today;
//       }

//       await user.save();
//     }

//     return res.json({ dailyIncome, totalIncome: user.income });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });



// Route to get user's daily earnings
// router.get('/daily-level-income/users/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Get all income records for the user
//     const userIncome = await User.find({ userId });

//     // Calculate the daily earnings
//     const dailyEarnings = userIncome.map((income, index, arr) => {
//       if (index === 0) {
//         return {
//           date: income.date,
//           dailyIncome: income.income,
//         };
//       }

//       const previousIncome = arr[index - 1].income;
//       const dailyIncome = income.income - previousIncome;

//       return {
//         date: income.date,
//         dailyIncome,
//       };
//     });

//     res.status(200).json(dailyEarnings);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// Route to get user's daily earnings
// router.get('/daily-level-income/users/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Get all income records for the user
//     const userIncome = await User.find({ userId }).sort({ date: 'asc' });

//     // Calculate the daily earnings
//     let dailyEarnings = [];
//     let previousIncome = 0;

//     userIncome.forEach((income) => {
//       const dailyIncome = income.income - previousIncome;
//       dailyEarnings.push({
//         date: income.date,
//         dailyIncome,
//       });
//       previousIncome = income.income;
//     });

//     res.status(200).json(dailyEarnings);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });



module.exports = router;
