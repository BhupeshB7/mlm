// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();
// const cron = require('node-cron');
// const app = express();
// const http = require('http');
// const socketIo = require('socket.io');
// const profileRoutes = require('./routes/profile');
// const passwordRoute = require('./routes/passwordReset');
// const register = require('./routes/register');
// const taskRoutes = require('./routes/taskRoute');
// const userTaskRoute = require('./routes/userTaskRoute');
// // const cloudinaryConfig = require("./cloudinaryConfig");
// const cloudinaryConfig= require("./cloudinaryConfig");
// const User = require('./models/User');
// // Connect to MongoDB database
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//     .then(() => console.log('Connected to MongoDB'))
    
//     .catch((error) => console.error(error));
  
  

//   const server = http.createServer(app);
//   const io = socketIo(server, {
//     cors: {
//       origin: "*", // Replace with your React frontend URL
//       // origin: "http://127.0.0.1:5501", // Replace with your React frontend URL
//       // origin: "http://localhost:5173", // Replace with your React frontend URL
//       methods: ["GET", "POST"]
//     }
//   });
//   // Middleware
//   app.use(cors({
//     // origin:"https://globalsuccesspoint.netlify.app"
//     // origin:"https://powerfullindia.com",
//     // origin:"https://www.powerfullindia.com",
//     // origin:"http://localhost:3000",
//   }));
//   cloudinaryConfig();
//   app.use(express.json());
//   // app.use(fileUpload())
// // error handler middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// //For Task
// app.use('/api/task', require('./routes/task'));
// //
// app.use("/api/users", require("./routes/users"));
// //for User Register
// app.use('/api/users', register);
// //for User ReTopup
// app.use('/api/users',require('./routes/ReTopupUser'));
// //for password Reset
// app.use('/api/auth', passwordRoute);
// //Activation Routes
// app.use('/api/active',require('./routes/UserAuthTask'));
// // profile Routes
// app.use('/api/users', profileRoutes);
// //Admin Routes
// app.use("/api/admin", require('./routes/Admin/admin'));
//   //Deposit Routes
//   app.use('/api/deposit', require('./routes/deposit'));
// //Withdraw request
// app.use('/api/withdraw', require('./routes/withdraw'));
// //direct request
// app.use('/api', require('./routes/direct'));
// //Task Completion
// app.use('/api', require('./routes/level'));
// //level
// // app.use('/api', require('./routes/userLevel'));
// app.use('/api', require('./routes/DailyLevelincome'))
// // for fund Transfer
// app.use('/api', require('./routes/fundMove'))
// //contact
// app.use('/api', require('./routes/contact'));
// app.use('/api', taskRoutes);
// app.use('/userTasks', userTaskRoute);
// // Routes
// app.use('/api/gameProfile',require('./routes/GameRoutes'));
// app.use('/api/game',require('./routes/game'));
// app.use('/api',require('./routes/LiveGameUser'));
// app.use('/api',require('./routes/GameDeposit'));
// app.use('/api',require('./routes/image'));
// app.use('/api',require('./routes/WalletTransfer'));
// app.use('/api',require('./routes/changePassword'));
// app.use('/api/notice',require('./routes/notice'));
// // router.use(express.json());

// cron.schedule('50 23 * * *', async () => {
//   try {
//     // Reset dailyIncome for all users
//     await User.updateMany({}, { $set: { dailyIncome: 0 } });
//     console.log('Daily income reset successful');
//   } catch (error) {
//     console.error('Error resetting daily income:', error);
//   }
// }, {
//   timezone: 'Asia/Kolkata', // Set the timezone to IST
// });
// const imageSchema = new mongoose.Schema({
//   name: String,
//   data: Buffer,
//   contentType: String,
// });

// const Image = mongoose.model('CarouselImage', imageSchema);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use(express.json());

// app.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     const { originalname, buffer, mimetype } = req.file;
//     const image = new Image({
//       name: originalname,
//       data: buffer,
//       contentType: mimetype,
//     });
//     await image.save();
//     res.status(201).send('Image uploaded successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/images', async (req, res) => {
//   try {
//     const images = await Image.find();
//     res.json(images);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.delete('/delete/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     await Image.findByIdAndDelete(id);
//     res.status(200).send('Image deleted successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// // 
//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Server error');
//   });
  
//   // 

  
//   // Start server
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  

























const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cloudinaryConfig = require("./cloudinaryConfig");
const User = require('./models/User');
const taskRoutes = require('./routes/taskRoute');
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Replace with your React frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
// app.use(cors());
  app.use(cors({
    // origin:"https://powerfullindia.com",
    origin:"https://www.powerfullindia.com",
    // origin:"http://localhost:3000",
  }));
cloudinaryConfig();
app.use(express.json());

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use('/api', taskRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use('/api/task', require('./routes/task'));
app.use("/api/users", require("./routes/users"));
app.use('/api/users', require('./routes/register'));
app.use('/api/users', require('./routes/ReTopupUser'));
app.use('/api/auth', require('./routes/passwordReset'));
app.use('/api/active', require('./routes/UserAuthTask'));
app.use('/api/users', require('./routes/profile'));
app.use("/api/admin", require('./routes/Admin/admin'));
app.use('/api/deposit', require('./routes/deposit'));
app.use('/api/withdraw', require('./routes/withdraw'));
app.use('/api', require('./routes/direct'));
app.use('/api', require('./routes/level'));
app.use('/api', require('./routes/DailyLevelincome'));
app.use('/api', require('./routes/fundMove'));
app.use('/api', require('./routes/contact'));
app.use('/api', require('./routes/fundMove'));
app.use('/userTasks', require('./routes/userTaskRoute'));
app.use('/api/gameProfile', require('./routes/GameRoutes'));
app.use('/api/game', require('./routes/game'));
app.use('/api', require('./routes/LiveGameUser'));
app.use('/api', require('./routes/GameDeposit'));
app.use('/api', require('./routes/image'));
app.use('/api', require('./routes/WalletTransfer'));
app.use('/api', require('./routes/changePassword'));
app.use('/api', require('./routes/notice'));

// Schedule daily income reset using cron
cron.schedule('55 23 * * *', async () => {
  try {
    // Reset dailyIncome for all users
    await User.updateMany({}, { $set: { dailyIncome: 0 } });
    console.log('Daily income reset successful');
  } catch (error) {
    console.error('Error resetting daily income:', error);
  }
}, {
  timezone: 'Asia/Kolkata', // Set the timezone to IST
});
// 3minutes Games Schema Start
const randomDataSchema = new mongoose.Schema({
  color: String,
  letter: String,
  number: String,
  session: String,
}, { timestamps: true });

const RandomData = mongoose.model('RandomData', randomDataSchema);

// 3minutes Games Schema End
// 
// Image upload routes
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});
const Image = mongoose.model('CarouselImage', imageSchema);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
// 3Minutes Game COde
// Pagination endpoint
app.get('/api/randomData', async (req, res) => {
  const perPage = 15;
  const page = req.query.page || 1;

  try {
    const data = await RandomData.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalDocuments = await RandomData.countDocuments();
    const totalPages = Math.ceil(totalDocuments / perPage);

    res.json({
      data,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const getRandomValue = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const generateAndSaveRandomData = async () => {
  try {
    const randomColor = getRandomValue(["Violet", "Red", "Green"]);
    const randomNumber = getRandomValue(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    const randomLetter = getRandomValue(["Small", "Big"]);
    // Generate the session information
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get current month with leading zero
    const currentDay = currentDate.getDate().toString().padStart(2, '0'); // Get current day with leading zero
    const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0'); // Get current minutes with leading zero
    const sessionPrefix = 'PI11-';
    const session = `${sessionPrefix}${currentMonth}${currentDay}-00${currentMinutes}`;
    
    const newData = new RandomData({
      color: randomColor,
      letter: randomLetter,
      number: randomNumber,
      session: session,
    });

    await newData.save();

    // console.log('Generated and saved random data:', newData);

    // Emit the new data to all connected clients
    io.emit('newData', newData);

    return newData;
  } catch (error) {
    // console.error('Error generating and saving random data:', error);
    throw error;
  }
};

const displayDataAndRestartTimer = async () => {
  try {
    const newData = await generateAndSaveRandomData();
    // console.log(`Generated and saved random data after timer end:`, newData);

    // Auto-restart the timer for 3 minutes
    startTimer();
  } catch (error) {
    // console.error('Error fetching and saving random data after timer end:', error);
    // Log the error and continue; you might want to handle this more gracefully
  }
};

const startTimer = () => {
  let timerCountdown = 3 * 60; // 3 minutes

  const timerId = setInterval(async () => {
    try {
      const response = await axios.post('https://mlm-production.up.railway.app/api/generateRandomData');
      // console.log('Automatic API call successful:', response.data);

      // console.log(`Color: ${response.data.data.color}, Letter: ${response.data.data.letter}, Number: ${response.data.data.number}`);

      timerCountdown = 3 * 60; // Restart the timer

      // Emit the timer countdown to all connected clients
      io.emit('timerUpdate', { countdown: timerCountdown });
    } catch (error) {
      // console.error('Error making automatic API call:', error.message);
    //   Log the error and continue; you might want to handle this more gracefully
    }

    // console.log(`Timer: ${timerCountdown} seconds remaining`);
    timerCountdown--;
 // Emit the timer countdown to all connected clients
 io.emit('timerUpdate', { countdown: timerCountdown });
    if (timerCountdown < 0) {
      clearInterval(timerId);
      displayDataAndRestartTimer();
    }
  }, 1000);
};
startTimer();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial data and timer countdown to the client when connected
  RandomData.findOne({}, {}, { sort: { 'created_at': -1 } }, (err, data) => {
    if (data) {
      socket.emit('initialData', data);
    }

    // Emit the initial timer countdown to the client
    socket.emit('timerUpdate', { countdown: 3 * 60 }); // Initial countdown value
  });
});

// 3Minutes Game COde
// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
