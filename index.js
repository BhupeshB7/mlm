const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const app = express();
const profileRoutes = require('./routes/profile');
const passwordRoute = require('./routes/passwordReset');
const register = require('./routes/register');
const taskRoutes = require('./routes/taskRoute');
const userTaskRoute = require('./routes/userTaskRoute');
// const cloudinaryConfig = require("./cloudinaryConfig");
const cloudinaryConfig= require("./cloudinaryConfig");
// const cloudinary = require('cloudinary').v2;
// const User = require('./models/User');
// const config = require('./config');
// const imageRoutes = require('./routes/CloudinaryImage');
// const fileUpload = require("express-fileupload");
// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to MongoDB'))
    
    .catch((error) => console.error(error));
  // Middleware
  app.use(cors({
    // origin:"https://globalsuccesspoint.netlify.app"
    // origin:"https://powerfullindia.com",
    origin:"https://www.powerfullindia.com",
    // origin:"http://localhost:3000",
  }));
  cloudinaryConfig();
  app.use(express.json());
  // app.use(fileUpload())
// error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Configure Cloudinary
// const { cloud_name, api_key, api_secret } = config.cloudinary;
// cloudinary.config({
//   cloud_name,
//   api_key,
//   api_secret,
// });
// Use image routes
// app.use('/api', imageRoutes);
// 
// Routes
app.use("/api/auth", require("./routes/auth"));
//For Task
app.use('/api/task', require('./routes/task'));
//
app.use("/api/users", require("./routes/users"));
//for User Register
app.use('/api/users', register);
//for User ReTopup
app.use('/api/users',require('./routes/ReTopupUser'));
//for password Reset
app.use('/api/auth', passwordRoute);
//Activation Routes
app.use('/api/active',require('./routes/UserAuthTask'));
// profile Routes
app.use('/api/users', profileRoutes);
//Admin Routes
app.use("/api/admin", require('./routes/Admin/admin'));
  //Deposit Routes
  app.use('/api/deposit', require('./routes/deposit'));
//Withdraw request
app.use('/api/withdraw', require('./routes/withdraw'));
//direct request
app.use('/api', require('./routes/direct'));
//Task Completion
app.use('/api', require('./routes/level'));
//level
// app.use('/api', require('./routes/userLevel'));
app.use('/api', require('./routes/DailyLevelincome'))
// for fund Transfer
app.use('/api', require('./routes/fundMove'))
//contact
app.use('/api', require('./routes/contact'));
app.use('/api', taskRoutes);
app.use('/userTasks', userTaskRoute);
// Routes
app.use('/api/gameProfile',require('./routes/GameRoutes'));
app.use('/api/game',require('./routes/game'));
app.use('/api',require('./routes/LiveGameUser'));
app.use('/api',require('./routes/GameDeposit'));
app.use('/api',require('./routes/image'));
app.use('/api',require('./routes/WalletTransfer'));
app.use('/api',require('./routes/changePassword'));
app.use('/api/notice',require('./routes/notice'));
// router.use(express.json());
   // Admin 
// // Define a cron job that runs every 10 minutes
// cron.schedule('*/1 * * * *', async () => {
//   try {
//     // Find users with income wallet greater than 0
//     const users = await User.find({ income: { $gt: 0 } });

//     for (const user of users) {
//       // Transfer income wallet amount to past income wallet
//       user.pastIncome += user.income;
//       // Add new income to the income wallet
//       // Replace 3000 with the actual new income amount
//       user.income = user.income + 3000;

//       // Save the updated user data
//       await user.save();
//     }

//     console.log('Income transfer and update completed.');
//   } catch (error) {
//     console.error('Error in background task:', error);
//   }
// });
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

const Image = mongoose.model('CarouselImage', imageSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const image = new Image({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });
    await image.save();
    res.status(201).send('Image uploaded successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Image.findByIdAndDelete(id);
    res.status(200).send('Image deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error');
  });
  
  // 
  
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  