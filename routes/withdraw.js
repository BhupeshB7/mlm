const express = require("express");
// import database models
const User = require("../models/User");
const WithdrawalReq = require("../models/WithdrawReq");
const WithdrawBalance = require("../models/WithdrawBalance");

// router.use(express.json());
const router = express.Router();
//withdrwal code
// Function to check if the user has at least two direct referrals
// Function to check if the current time is after 1 PM IST
function isAfter1PMIST() {
  const now = new Date();
  const currentHourIST = now.getUTCHours() + 5; // Add 5 hours to UTC time for IST
  return currentHourIST >= 13; // 13 represents 1 PM in 24-hour format
}
function isBefore9AMIST() {
  const now = new Date();
  const ISTOffset = 330; // IST offset in minutes
  const currentTimeIST = new Date(now.getTime() + ISTOffset * 60000);
  return currentTimeIST.getHours() < 9;
}

// Create a new user withdrawal request
// router.post("/user/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const { amount, GPay, ifscCode, accountNo, accountHolderName } = req.body;

//   try {
//     const user = await User.findOne({ userId });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // Check if the current day is Sunday (day 0)
//     // const today = new Date();
//     // if (today.getDay() === 0) {
//     //   return res
//     //     .status(400)
//     //     .json({ error: "Withdrawal is not allowed on Sundays." });
//     // }
//       // Check if it's after 1 PM IST
//       // if (isAfter1PMIST()) {
//       //   return res.status(400).json({ error: 'Withdrawal is not allowed after 1 PM IST.' });
//       // }

//     // Check if the withdrawal amount is greater than 0
//     if (amount <= 0) {
//       return res
//         .status(400)
//         .json({ error: "Withdrawal amount should be greater than 0" });
//     }

//     // Check if the user is active
//     if (!user.is_active) {
//       return res
//         .status(400)
//         .json({ error: "User is not active and cannot make withdrawals" });
//     }

//     // Special case: First-time withdrawal of 200 Rs
//     if (amount === 200) {
//       // Create a new withdrawal request
//       const withdrawalRequest = new WithdrawalReq({
//         userId,
//         amount,
//         GPay,
//         ifscCode,
//         accountNo,
//         accountHolderName,
//       });

//       await withdrawalRequest.save();

//       // Update user withdrawal and balance
//       user.withdrawal += amount;
//       user.balance -= amount;
//       user.withdrawalDone = true;
//       await user.save();

//       return res.json({ success: true });
//     }
// if(amount <500) {
//   return res
//   .status(400)
//   .json({ error: "Amount should be Greater than 500" });
// }

//     // Check if user has at least two direct referrals
//     const hasTwoDirectReferrals = await hasAtLeastTwoDirectReferrals(userId);

//     // Check withdrawal conditions based on the number of direct referrals
//     if (hasTwoDirectReferrals) {
//       // Allow withdrawal of any amount greater than 800 Rs (unlimited)
//       // You can add additional checks if needed
//       // Create a new withdrawal request
//       const withdrawalRequest = new WithdrawalReq({
//         userId,
//         amount,
//         GPay,
//         ifscCode,
//         accountNo,
//         accountHolderName,
//       });

//       await withdrawalRequest.save();

//       // Update user withdrawal and balance
//       user.withdrawal += amount;
//       user.balance -= amount;
//       await user.save();

//       return res.json({ success: true });
//     } else if (amount === 400) {
//       // Allow withdrawal of 400 Rs if the user has one direct referral
//       // Create a new withdrawal request
//       const withdrawalRequest = new WithdrawalReq({
//         userId,
//         amount,
//         GPay,
//         ifscCode,
//         accountNo,
//         accountHolderName,
//       });

//       await withdrawalRequest.save();

//       // Update user withdrawal and balance
//       user.withdrawal += amount;
//       user.balance -= amount;
//       await user.save();

//       return res.json({ success: true });
//     } else {
//       return res
//         .status(400)
//         .json({
//           error: "Invalid withdrawal amount or referral conditions not met",
//         });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });





//withdrawal code end
//for MLM
// All withdrawal Code
router.post('/user/:userId', async (req, res) => {
  const { userId} = req.params;
  const { amount, ifscCode, accountNo, accountHolderName } = req.body;
  const user = await User.findOne({ userId: userId});

  // Check if the withdrawal amount is greater than 0
  if (amount <= 0) {
    return res.status(400).json({ error: 'Withdrawal amount should be greater than 0' });
  }
  // Check if the withdrawal amount is greater than or equal to 500
  if (amount >= 500) {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    //     // Check if the current day is Sunday (day 0)
    const today = new Date();
    if (today.getDay() === 0) {
      return res
        .status(400)
        .json({ error: "Withdrawal is not allowed on Sundays." });
    }
     // Check if it's before 8 AM IST
     if (isBefore9AMIST()) {
      return res.status(400).json({ error: 'Withdrawal is not allowed before 9 AM IST.' });
    }

      // Check if it's after 1 PM IST
      if (isAfter1PMIST()) {
        return res.status(400).json({ error: 'Withdrawal is not allowed after 1 PM IST.' });
      }
    // Check if the user is active
  if (!user.is_active) {
    return res.status(400).json({ error: 'User is not active and cannot make withdrawals' });
  }
    //   // check if the withdrawal amount is greater than or equal to 500
      if (amount < 500) {
        return res.status(400).json({ error: 'Minimum withdrawal amount is 500 Rs' });
      }
    // Check if user has at least two direct referrals
    const count = await User.countDocuments({ sponsorId: userId, is_active:true   });
    console.log(count)
    if (count < 2) {
      return res.status(400).json({ error: 'Minimum Two Direct for Withdrawal' });
    }

    // Check if user balance is sufficient for the withdrawal
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create a new withdrawal request
    const withdrawalRequest = new WithdrawBalance({
      userId,
      amount,
      ifscCode,
      accountNo,
      accountHolderName
    });

    await withdrawalRequest.save();

    // Update user withdrawal and balance
    user.withdrawal += amount;
    user.balance -= amount;
    await user.save();

    return res.json({ success: true });
  } 
  else if (amount === 200) {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has already made a withdrawal of 200 Rs
    if (user.withdrawalDone) {
      return res.status(403).json({ error: 'Withdrawal of 200 Rs already done' });
    }

    // Check if user balance is sufficient for the withdrawal
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create a new withdrawal request
    const withdrawalRequest = new WithdrawBalance({
      userId,
      amount,
      ifscCode,
      accountNo,
      accountHolderName
    });

    await withdrawalRequest.save();

    // Update user withdrawal and balance
    user.withdrawal += amount;
    user.balance -= amount;
    user.withdrawalDone = true;
    await user.save();

    return res.json({ success: true });
  }
  else if (amount === 400) {

    const count1 = await User.countDocuments({ sponsorId: userId, is_active:true   });
    // console.log(count1)
     // Check if user has already made a withdrawal of 200 Rs
     if (user.withdrawalDoneFour && amount === 400) {
      return res.status(403).json({ error: 'Withdrawal of 400 Rs already done' });
    }
    if (count1 < 1) {
      return res.status(400).json({ error: 'Minimum One Direct for Withdrawal' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   

    // Check if user balance is sufficient for the withdrawal
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create a new withdrawal request
    const withdrawalRequest = new WithdrawBalance({
      userId,
      amount,
      ifscCode,
      accountNo,
      accountHolderName
    });

    await withdrawalRequest.save();

    // Update user withdrawal and balance
    user.withdrawal += amount;
    user.balance -= amount;
    user.withdrawalDoneFour = true;
    await user.save();

    return res.json({ success: true });
  }
  else {
    return res.status(400).json({ error: 'Minimum withdrawal amount is 500 Rs' });
  }
});
// Withdrawal code ENd

// router.post('/withdraw/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const { amount, GPay, ifscCode, accountNo, accountHolderName } = req.body;
//   const user = await User.findOne({ userId: userId });

//   // Check if the withdrawal amount is greater than 0
//   if (amount <= 0) {
//     return res.status(400).json({ error: 'Withdrawal amount should be greater than 0' });
//   }

//   // Check if the user is active
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   if (amount === 200) {
//     // Check if user has already made a withdrawal of 200 Rs
//     // if (user.withdrawalDone) {
//     //   return res.status(403).json({ error: 'Withdrawal of 200 Rs already done' });
//     // }

//     //    Check if user balance is sufficient for the withdrawal
//     // if (user.balance < amount) {
//     //   return res.status(400).json({ error: 'Insufficient balance' });
//     // }

//     // Create a new withdrawal request
//     const withdrawalRequest = new WithdrawalReq({
//       userId,
//       amount,
//       GPay,
//       ifscCode,
//       accountNo,
//       accountHolderName,
//     });

//     await withdrawalRequest.save();

//     // Update user withdrawal and balance
//     user.withdrawal += amount;
//     user.balance -= amount;
//     user.withdrawalDone = true;
//     await user.save();

//     return res.json({ success: true });
//   } else {
//     return res.status(400).json({ error: 'Only 200 Rs withdrawal allowed' });
//   }
// });

// endpoint for admin to fetch a specific withdrawal request
router.get("/withdrawals/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const withdrawalRequest = await WithdrawBalance.find({ userId: userId });
    if (!withdrawalRequest) {
      return res.status(404).json({ error: "Withdrawal request not found" });
    }
    res.json(withdrawalRequest);
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint for admin to fetch all withdrawal requests
// router.get('/withdrawals', async (req, res) => {

//   const withdrawalQuerySearch = req.query.search;
//   const searchRegx = new RegExp(withdrawalQuerySearch, 'i');

//   try {
//     const withdrawalRequests = await WithdrawalReq.find({
//       $or:[
//         {name: searchRegx},
//         {userId: searchRegx}
//       ]
//     });
//     res.json(withdrawalRequests);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
// endpoint for admin to fetch paginated withdrawal requests
router.get("/withdrawals", async (req, res) => {
  const withdrawalQuerySearch = req.query.search;
  const searchRegx = new RegExp(withdrawalQuerySearch, "i");

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 20; // Default to 10 items per page

  const skip = (page - 1) * limit;

  try {
    const query = {
      $or: [{ name: searchRegx }, { userId: searchRegx }],
    };

    const totalItems = await WithdrawBalance.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const withdrawalRequests = await WithdrawBalance.find(query)
      .skip(skip)
      .limit(limit);

    res.json({
      withdrawalRequests,
      totalPages,
      currentPage: page,
      totalItems,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint for admin to update the status and transaction number of a withdrawal request
router.put("/withdrawals/:id", async (req, res) => {
  const { id } = req.params;
  const { status, transactionNumber } = req.body;
  try {
    const withdrawalRequest = await WithdrawBalance.findByIdAndUpdate(
      id,
      { status , transactionNumber },
      { new: true }
    );
    if (!withdrawalRequest) {
      return res.status(404).json({ error: "Withdrawal request not found" });
    }
    withdrawalRequest.status = 'approved';
    await withdrawalRequest.save();
    res.json(withdrawalRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Delete a user
router.delete("/withdrawalWallet/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await WithdrawBalance.findByIdAndDelete({ _id: id });
    res.status(200).send("Deleted successfully"); // Success, no content
  } catch (error) {
    // console.error(error);
    res.status(500).send("something went wrong"); // Internal server error
  }
});
module.exports = router;
