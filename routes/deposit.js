const express = require("express");
const router = express.Router();
const Deposit = require("../models/Deposit");
const imageValidate = require("../utils/imageValidate");
// const User = require('../models/User');
const User = require("../models/User");
const cloudinary = require('cloudinary').v2;
const TopUpHistory1 = require("../models/TopUpHistory1");
const GameDeposit = require("../models/GameDeposit");
const fileUpload = require('express-fileupload');

// Middleware for handling file uploads
router.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

// API endpoint for creating a new deposit record
router.post('/userAmount', async (req, res) => {
  try {
    const { name, transactionId, userID, depositAmount } = req.body;

  // Check if file was uploaded
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
   // Check if the transactionId already exists in the database
   const existingDeposit = await Deposit.findOne({ transactionId });
   if (existingDeposit) {
     return res.status(400).json({ message: 'Transaction Id already exists' });
   }

  const imageFile = req.files.image;

  // console.log('Uploaded file:', imageFile); // Log uploaded file for debugging

  // Upload image to Cloudinary
  const result = await cloudinary.uploader.upload(imageFile.tempFilePath);

  // console.log('Cloudinary upload result:', result); // Log Cloudinary upload result

    // Create a new deposit record
    const newDeposit = new Deposit({
      name,
      transactionId,
      userID,
      depositAmount,
      images: [{ public_id: result.public_id }],
    });

    // Save the new deposit record to the database
    await newDeposit.save();

    res.status(201).json({ message: 'Deposit record created successfully' });
  } catch (error) {
    console.error('Error creating deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//for game deposit code
router.post('/userAmount/gameDeposit', async (req, res) => {
  try {
    const { name, transactionId, userId, depositAmount } = req.body;

  // Check if file was uploaded
  if (!req.files || !req.files.image) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
   // Check if the transactionId already exists in the database
   const existingDeposit = await GameDeposit.findOne({ transactionId });
   if (existingDeposit) {
     return res.status(400).json({ message: 'Transaction Id already exists' });
   }

  const imageFile = req.files.image;

  // console.log('Uploaded file:', imageFile); // Log uploaded file for debugging

  // Upload image to Cloudinary
  const result = await cloudinary.uploader.upload(imageFile.tempFilePath);

  // console.log('Cloudinary upload result:', result); // Log Cloudinary upload result

    // Create a new deposit record
    const newDeposit = new GameDeposit({
      name,
      transactionId,
      userId,
      depositAmount,
      images: [{ public_id: result.public_id }],
    });

    // Save the new deposit record to the database
    await newDeposit.save();

    res.status(201).json({ message: 'Deposit record created successfully' });
  } catch (error) {
    console.error('Error creating deposit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/depositHistory/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const perPage = 10; // Number of records per page
    const totalRecords = await Deposit.countDocuments({ userID: userId });
    const totalPages = Math.ceil(totalRecords / perPage);
    const skip = (page - 1) * perPage;
    const depositHistory = await Deposit.find({ userID: userId })
      .skip(skip)
      .limit(perPage)
      .select("-images");
    if (!depositHistory || depositHistory.length === 0) {
      res.status(404).json({ message: "User not found or no deposit history available" });
    } else {
      res.status(200).json({ depositHistory, currentPage: page, totalPages });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// // POST endpoint for handling deposit submissions
// router.post("/userAmount", async (req, res) => {
//   try {
//     const { name, transactionId, userID, depositAmount } = req.body;

//     // Check if the transactionId already exists in the database
//     const existingDeposit = await Deposit.findOne({ transactionId });
//     if (existingDeposit) {
//       return res.status(400).json({ message: "Transaction Id already exists" });
//     }

//     // Create a new deposit record
//     const newDeposit = new Deposit({
//       name,
//       transactionId,
//       userID,
//       depositAmount,
//     });

//     // Save the deposit to the database
//     await newDeposit.save();

//     res.status(201).json({ message: "Deposit successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
// router.post("/user", async (req, res) => {
//   try {
//     const { name, transactionId, userID, depositAmount } = req.body;

//     const transaction = await Deposit.findOne({ transactionId });
//     if (transaction) {
//       return res.status(400).json({ error: "transactionId already exists" });
//     }
// else{

//   const user = new Deposit({ name, transactionId, userID, depositAmount });
//   await user.save();
//   console.log("userID:", userID);

//   // Update the topupWallet in the User schema with the depositAmount
//   const userToUpdate = await User.findOne({userId:userID});
//   console.log("userToUpdate:", userToUpdate);
//   console.log("depositAmount:", depositAmount);

//   if (!userToUpdate) {
//     console.log(`User with userId ${userID} not found`);
//     return res.status(404).json({ error: "User not found" });
//   }

//   userToUpdate.topupWallet += depositAmount;
//   await userToUpdate.save();
//   console.log("Updated topupWallet:", userToUpdate.topupWallet);
 
//   res.json({ message: "Deposit successful", user: userToUpdate });
// }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/depositusers", async (req, res) => {
//   try {
//     const searchDepositQuery = req.query.search; // Get the search query parameter from the request

//     // Use a regular expression to perform a case-insensitive search for the given query
//     const searchRegex = new RegExp(searchDepositQuery, "i");
//     // const totalUsers = await Deposit.countDocuments();

//     const users = await Deposit.find({
//       $or: [
//         { name: searchRegex },
//         { userID: searchRegex },
//         { transactionId: searchRegex },
//       ],
//     });
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });




const ITEMS_PER_PAGE = 10; // Number of items to show per page

router.get("/depositusers", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the request query, default to 1 if not provided
    const searchDepositQuery = req.query.search;

    const searchRegex = new RegExp(searchDepositQuery, "i");

    const totalUsers = await Deposit.countDocuments({
      $or: [
        { name: searchRegex },
        { userID: searchRegex },
        { transactionId: searchRegex },
      ],
    });

    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const users = await Deposit.find({
      $or: [
        { name: searchRegex },
        { userID: searchRegex },
        { transactionId: searchRegex },
      ],
    })
      .skip(skip)
      .limit(ITEMS_PER_PAGE);

    res.json({ users, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/image/:productId", async (req, res) => {
  try {
    if (!req.files || !!req.files.images === false) {
      return res.status(400).json({ error: "error" });
    }

    const validateResult = imageValidate(req.files.images);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
      // console.log('error')
    }

    const path = require("path");
    const uploadDirectory = path.resolve(
      __dirname,
      "../../frontend",
      "public",
      "images"
    );
    const { v4: uuidv4 } = require("uuid");

    // console.log(req.params.productId)
    let product = await Deposit.findById(req.params.productId);
    let imagesTable = [];

    if (Array.isArray(req.files.images)) {
      // res.send("You sent " + req.files.images.length + " images")
      imagesTable = req.files.images;
    } else {
      // res.send("You sent only one image")
      imagesTable.push(req.files.images);
    }

    for (let image of imagesTable) {
      // console.log(image)
      // console.log(path.extname(image.name))
      // console.log(uuidv4())
      var uploadPath =
        uploadDirectory + "/" + uuidv4() + path.extname(image.name);
      var fileName = uuidv4() + path.extname(image.name);
      var uploadPath = uploadDirectory + "/" + fileName;
      product.images.push({ path: "/images/" + fileName });
      image.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }
    await product.save();
    return res.send("files uploaded.");
  } catch (err) {
    // console.log(err)
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/delete", async (req, res) => {
  try {
    await Deposit.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting all users" });
  }
});

router.post("/topUpActivate", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ userId })
      .select("userId is_active name")
      .lean()
      .exec();

    if (!user) {
      return res.json({ status: "not_found", message: "User not found" });
    }

    // Assuming you have an 'is_active' property in the User model
    if (user.is_active) {
      return res.json({ name:user.name, status: true });
    } else {
      return res.json({ name:user.name, status: false });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const activateUser = async (userId) => {
  try {
    const activationTime = new Date();
    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { is_active: true, activationTime },
      { new: true }
    );

    updatedUser.lastUpdated = new Date();
    await updatedUser.save();

    return updatedUser;
  } catch (error) {
    return null;
  }
};
// Helper function to check if 45 days have passed since activation
const isAutoDeactivateTime = (activationTime) => {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - activationTime.getTime();
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return daysDifference >= 60;
};
// router.post("/topUpUserID/:userID", async (req, res) => {
//   try {
//     const { userID } = req.params;
//     const deposit = await User.findOne({ userId:userID }).select("userId topupWallet balance is_active name").lean().exec();

//     if (!deposit) {
//       return res.status(401).send("User not found!");
//     }

    
//       const { userId } = req.body;
//       const activeUser = await User.findOne({ userId }).select("userId is_active topupWallet name").lean().exec();

//       if (activeUser.is_active) {
//         if (isAutoDeactivateTime(activeUser.activationTime)) {
//           activeUser.is_active = false;
//           await User.findOneAndUpdate({ userId }, { is_active: false });
//           return res.status(201).send("User auto-deactivated after 45 days of activation.");
//         }
//         return res.status(201).send("User already activated!");
//       }

//       // const depositUser = await Deposit.findOne({ userID });

//       // if (depositUser.depositAmount < 800) {
//       //   return res.status(400).json({ error: "Low Balance" });
//       // }

//       const activationStatus = await activateUser(userId);

//       if (activationStatus) {
//         const topUpAmount = 850;
//         // depositUser.depositAmount -= topUpAmount;
//         // await depositUser.save();

//         const activeDeposit = await User.findOne({userId:userID})
//         if (activeDeposit.topupWallet < 850) {
//           return res.status(400).json({ error: "Low Balance" });
//         }
//         activeDeposit.topupWallet -= topUpAmount;
//         await activeDeposit.save();
        
//         return res.status(201).json({ success: "User Activated", user: activationStatus });
//       } else {
//         return res.json({ error: "Failed to activate user." });
//       }
   
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "An error occurred. Please try again later." });
//   }
// });


router.post("/topUpUserID/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const deposit = await User.findOne({ userId: userID })
      .select("userId topupWallet balance is_active name")
      .lean()
      .exec();

    if (!deposit) {
      return res.status(401).json({success:'false',error:"User Not Found!"});
    }

    const { userId } = req.body;
    const activeUser = await User.findOne({ userId })
      .select("userId is_active topupWallet name")
      .lean()
      .exec();

    if (activeUser.is_active) {
      if (isAutoDeactivateTime(activeUser.activationTime)) {
        activeUser.is_active = false;
        await User.findOneAndUpdate({ userId }, { is_active: false });
        return res.status(201).send("User auto-deactivated after 45 days of activation.");
      }
      return res.status(201).send("User already activated!");
    }

    const activationStatus = await activateUser(userId);

    if (activationStatus) {
      const topUpAmount = 850;
      const activeDeposit = await User.findOne({ userId: userID });

      if (activeDeposit.topupWallet < topUpAmount) {
        return res.status(400).json({ error: "Low Balance" });
      }

      activeDeposit.topupWallet -= topUpAmount;
      await activeDeposit.save();

      // Create a new TopupHistory record for the top-up
      const topupHistory1 = new TopUpHistory1({
        // name: activeUser.name,
        userId: userID,
        targetUserId: userId,
      });

      // Save the top-up history record
      await topupHistory1.save();

      return res.status(201).json({ success: "User Activated", user: activationStatus });
    } else {
      return res.json({ error: "Failed to activate user." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});

// ... (Other routes)


router.patch("/activate/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await Deposit.findById(userID);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    user.isApproved = true;
    // user.activationTime = new Date();
    await user.save();
    const userD = user.userID;
   const userAccount =  await User.findOne({userId:userD}).select('_id topupWallet');
   if (!userAccount) {
    return res.status(401).json({ error: "User account not found" });
  }
     userAccount.topupWallet += user.depositAmount;
     await userAccount.save();
    res.json({message:'Approved', user});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/topUpuserAmount/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const deposit = await Deposit.findOne({ userID })
      .select("userID depositAmount isApproved")
      .lean()
      .exec();

    if (!deposit) {
      return res.status(401).send("User not found!");
    }

    return res.status(201).json({ deposit });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// router.delete('/delete/:id', async (req, res)=>{
//   try {
//     const {id} = req.params;
//     const depositDelete = await Deposit.findById({_id:id})
//     if(!depositDelete){
//       return res.status(401).send("User not found!");
//     }
//     await depositDelete.save();
//   } catch (error) {
//     res.status(500).send(error)
//     console.log(error)
//   }
// })

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const depositDelete = await Deposit.findById(id);

    if (!depositDelete) {
      return res.status(401).send("Deposit not found!");
    }

    await Deposit.deleteOne({ _id: id });
    res.status(200).send("Deposit deleted successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Deposit = require('../models/Deposit');
// const imageValidate = require('../utils/imageValidate');
// const Topup = require('../models/Topup');
// // const User = require('../models/user');
// const User = require('../models/User')
// //

// router.post('/user', async (req, res) => {
//   try {
//     const { name, transactionId, userID, depositAmount } = req.body;

//     const transaction = await Deposit.findOne({ transactionId });
//     if (transaction) {
//       return res.status(400).json({ error: 'TransactionId already exists' });
//     }

//     const user = new Deposit({ name, transactionId, userID, depositAmount });
//     await user.save();
//     res.json({ message: 'Uploaded successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.get('/depositusers', async (req, res) => {
//   try {
//     const searchDepositQuery = req.query.search;
//     const searchRegex = new RegExp(searchDepositQuery, 'i');
//     const users = await Deposit.find({
//       $or: [
//         { name: searchRegex },
//         { userID: searchRegex },
//         { transactionId: searchRegex }
//       ]
//     });
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/image/:productId', async (req, res) => {
//   try {
//     // ... (unchanged code)
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// const activateUser = async (userId, is_active) => {
//   try {
//     const activationTime = new Date();
//     const updatedUser = await User.findOneAndUpdate(
//       { userId: userId },
//       {
//         is_active: is_active,
//         activationTime: activationTime
//       },
//       { new: true }
//     );
//     if (updatedUser) {
//       return true; // Activation successful
//     } else {
//       return false; // Failed to update user
//     }
//   } catch (error) {
//     return false; // Error occurred during activation
//   }
// };

// router.post('/topUpUserID/:userID', async (req, res) => {
//   try {
//     // ... (unchanged code)
//   } catch (error) {
//     return res.status(500).json({ error: 'An error occurred. Please try again later.' });
//   }
// });

// router.patch('/activate/:id', async (req, res) => {
//   try {
//     const userID = req.params.id;
//     const user = await Deposit.findById(userID);
//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }

//     user.isApproved = true;
//     await user.save();

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.get('/topUpuserAmount/:userID', async (req, res) => {
//   try {
//     // ... (unchanged code)
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const depositDelete = await Deposit.findById(id);

//     if (!depositDelete) {
//       return res.status(401).send("Deposit not found!");
//     }

//     await Deposit.deleteOne({ _id: id });
//     res.status(200).send("Deposit deleted successfully!");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Deposit = require('../models/Deposit');
// const imageValidate = require('../utils/imageValidate');
// const Topup = require('../models/Topup');
// const User = require('../models/User');

// // router.post('/user', async (req, res) => {
// //   try {
// //     const { name, transactionId, userID, depositAmount } = req.body;

// //     const transaction = await Deposit.findOne({ transactionId });
// //     if (transaction) {
// //       return res.status(400).json({ error: 'transactionId already exists' });
// //     }

// //     const user = new Deposit({ name, transactionId, userID, depositAmount });
// //     await user.save();
// //     res.json({ message: 'uploaded successfully' });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // ...

// router.post('/user', async (req, res) => {
//   try {
//     const { name, transactionId, userID, depositAmount } = req.body;

//     const transaction = await Deposit.findOne({ transactionId });
//     if (transaction) {
//       return res.status(400).json({ error: 'transactionId already exists' });
//     }

//     const user = new Deposit({ name, transactionId, userID, depositAmount });
//     await user.save();

//     // Update the topupWallet in the User schema with the depositAmount
//     const userToUpdate = await User.findOne({ userId: userID });
//     if (userToUpdate) {
//       userToUpdate.topupWallet += depositAmount;
//       await userToUpdate.save();
//     }

//     res.json({ message: 'uploaded successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ...

// router.get('/depositusers', async (req, res) => {
//   try {
//     const searchDepositQuery = req.query.search;
//     const searchRegex = new RegExp(searchDepositQuery, 'i');

//     const users = await Deposit.find({
//       $or: [
//         { name: searchRegex },
//         { userID: searchRegex },
//         { transactionId: searchRegex },
//       ],
//     });
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/image/:productId', async (req, res) => {
//   // ... (No changes in the image upload code)
// });

// router.delete('/delete', async (req, res) => {
//   try {
//     await Deposit.deleteMany({});
//     res.status(200).json({ message: 'All users deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while deleting all users' });
//   }
// });

// const activateUser = async (userId, is_active) => {
//   try {
//     const activationTime = new Date();
//     const updatedUser = await User.findOneAndUpdate(
//       { userId: userId },
//       { is_active, activationTime },
//       { new: true }
//     );

//     if (updatedUser) {
//       const deductionAmount = 800; // Amount to be deducted from the topupWallet
//       updatedUser.topupWallet -= deductionAmount; // Deduct amount from topupWallet

//       await updatedUser.save(); // Save the updated User document

//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
// };

// router.post('/topUpUserID/:userID', async (req, res) => {
//   try {
//     const { userID } = req.params;
//     const deposit = await Deposit.findOne({ userID }).select('isApproved').lean().exec();

//     if (!deposit) {
//       return res.status(401).send('User not found!');
//     } else if (deposit.isApproved) {
//       const { userId, is_active, activationTime } = req.body;
//       const activeUser = await User.findOne({ userId }).select('userId is_active').lean().exec();

//       if (activeUser.is_active) {
//         return res.status(201).send('User Already Activated!');
//       }

//       const depositUser = await Deposit.findOne({ userID });

//       if (depositUser.depositAmount < 800) {
//         return res.status(400).json({ error: 'Low Balance' });
//       }

//       const activationStatus = await activateUser(userId, is_active, activationTime);

//       if (activationStatus) {
//         const { userID } = req.params;
//         const depositUser = await Deposit.findOne({ userID });
//         depositUser.depositAmount -= 800;
//         depositUser.save();
//         return res.status(201).json({ success: 'User Activated' });
//       } else {
//         return res.json({ error: 'Failed to activate user.' });
//       }
//     } else {
//       return res.json({ error: 'Your Deposit Amount is not Approved!' });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: 'An error occurred. Please try again later.' });
//   }
// });

// router.patch('/activate/:id', async (req, res) => {
//   try {
//     const userID = req.params.id;
//     const user = await Deposit.findById(userID);
//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }

//     user.isApproved = true;
//     await user.save();

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// router.get('/topUpuserAmount/:userID', async (req, res) => {
//   try {
//     const { userID } = req.params;
//     const deposit = await Deposit.findOne({ userID }).select('userID depositAmount isApproved').lean().exec();

//     if (!deposit) {
//       return res.status(401).send('User not found!');
//     }

//     return res.status(201).json({ deposit });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.delete('/delete/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const depositDelete = await Deposit.findById(id);

//     if (!depositDelete) {
//       return res.status(401).send('Deposit not found!');
//     }

//     await Deposit.deleteOne({ _id: id });
//     res.status(200).send('Deposit deleted successfully!');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// module.exports = router;
