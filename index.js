const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const cron = require("node-cron");
const schedule = require('node-schedule');
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cloudinaryConfig = require("./cloudinaryConfig");
const User = require("./models/User");
const taskRoutes = require("./routes/taskRoute");
const sessionRoutes = require("./routes/sessionRoutes");
const sessionRoutes3 = require("./routes/threeMinuteRoutes");
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Replace with your React frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
// app.use(cors());
app.use(
  cors({
    // origin:"https://powerfullindia.com",
    origin:"https://www.powerfullindia.com",
    origin: "*",
    // origin:"http://localhost:3000",
  })
);
cloudinaryConfig();
app.use(express.json());

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Routes
app.use("/api", taskRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/task", require("./routes/task"));
app.use("/api/users", require("./routes/users"));
app.use("/api/users", require("./routes/register"));
app.use("/api/users", require("./routes/ReTopupUser"));
app.use("/api/auth", require("./routes/passwordReset"));
app.use("/api/active", require("./routes/UserAuthTask"));
app.use("/api/users", require("./routes/profile"));
app.use("/api/admin", require("./routes/Admin/admin"));
app.use("/api/deposit", require("./routes/deposit"));
app.use("/api/withdraw", require("./routes/withdraw"));
app.use("/api", require("./routes/direct"));
app.use("/api", require("./routes/level"));
app.use("/api", require("./routes/DailyLevelincome"));
app.use("/api", require("./routes/fundMove"));
app.use("/api", require("./routes/contact"));
app.use("/api", require("./routes/fundMove"));
app.use("/userTasks", require("./routes/userTaskRoute"));
app.use("/api/gameProfile", require("./routes/GameRoutes"));
app.use("/api/game", require("./routes/game"));
app.use("/api", require("./routes/LiveGameUser"));
app.use("/api", require("./routes/GameDeposit"));
app.use("/api", require("./routes/image"));
app.use("/api", require("./routes/WalletTransfer"));
app.use("/api", require("./routes/changePassword"));
app.use("/api/notice", require("./routes/notice"));
app.use("/api/gift", require("./routes/GiftCode"));
app.use("/", sessionRoutes);
app.use("/three", sessionRoutes3);

// Schedule daily income reset using cron
cron.schedule(
  "55 23 * * *",
  async () => {
    try {
      // Reset dailyIncome for all users
      await User.updateMany({}, { $set: { dailyIncome: 0 } });
      console.log("Daily income reset successful");
    } catch (error) {
      console.error("Error resetting daily income:", error);
    }
  },
  {
    timezone: "Asia/Kolkata", // Set the timezone to IST
  }
);
// 3minutes Games Schema Start
const randomDataSchema = new mongoose.Schema(
  {
    color: String,
    letter: String,
    number: String,
    session: String,
  },
  { timestamps: true }
);

const RandomData = mongoose.model("RandomData", randomDataSchema);

// 3minutes Games Schema End
// 3minutes Games Schema Start
const randomDataSchema1 = new mongoose.Schema(
  {
    color: String,
    letter: String,
    number: String,
    session: String,
  },
  { timestamps: true }
);
// Define Timer schema
const timerSchema = new mongoose.Schema({
  time: Number,
},{timestamps:true});

const Timer = mongoose.model('Timer', timerSchema);

const RandomData1 = mongoose.model("RandomData1", randomDataSchema1);
// API endpoint for admin to set the timer
app.post('/api/admin/setTimer', async (req, res) => {
    try {
      const { time } = req.body;
      await Timer.findOneAndUpdate({}, { time }, { upsert: true });
  
      // Schedule job to delete the timer after the specified time
      schedule.scheduleJob(new Date(Date.now() + time * 60 * 1000), async () => {
        await Timer.deleteMany({});
      });
  
      res.status(200).json({ message: 'Timer set successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.get('/api/user/getTimer', async (req, res) => {
    try {
      const timer = await Timer.findOne();
      
      if (!timer || !timer.updatedAt) {
        // If no timer is set or createdAt is missing, return 0
        return res.status(200).json({ time: 0 });
      }
  
      const currentTime = Date.now();
      const scheduledDeletionTime = timer.updatedAt.getTime() + timer.time * 60 * 1000;
      const remainingTimeInSeconds = Math.max(0, Math.floor((scheduledDeletionTime - currentTime) / 1000));
  
      res.status(200).json({ time: remainingTimeInSeconds });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// 3minutes Games Schema End
//
// Image upload routes
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});
const Image = mongoose.model("CarouselImage", imageSchema);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const image = new Image({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });
    await image.save();
    res.status(201).send("Image uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Image.findByIdAndDelete(id);
    res.status(200).send("Image deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// Pagination endpoint
app.get("/api/randomData", async (req, res) => {
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getRandomValue = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const generateAndSaveRandomData = async () => {
  try {
    const randomColor = getRandomValue(["Violet", "Red", "Green"]);
    const randomNumber = getRandomValue([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    const randomLetter = getRandomValue(["Small", "Big"]);
    // Generate the session information
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Get current month with leading zero
    const currentDay = currentDate.getDate().toString().padStart(2, "0"); // Get current day with leading zero
    const currentMinutes = currentDate.getMinutes().toString().padStart(2, "0"); // Get current minutes with leading zero
    const sessionPrefix = "PI3323";
    const session = `${sessionPrefix}${currentMonth}${currentDay}0${currentMinutes}`;

    const newData = new RandomData({
      color: randomColor,
      letter: randomLetter,
      number: randomNumber,
      session: session,
    });

    await newData.save();

    // console.log('Generated and saved random data:', newData);

    // Emit the new data to all connected clients
    io.emit("newData", newData);

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
      const response = await axios.post(
        "https://mlm-production.up.railway.app/api/generateRandomData"
      );
      // console.log('Automatic API call successful:', response.data);

      // console.log(`Color: ${response.data.data.color}, Letter: ${response.data.data.letter}, Number: ${response.data.data.number}`);

      timerCountdown = 3 * 60; // Restart the timer

      // Emit the timer countdown to all connected clients
      io.emit("timerUpdate", { countdown: timerCountdown });
    } catch (error) {
      // console.error('Error making automatic API call:', error.message);
      //   Log the error and continue; you might want to handle this more gracefully
    }

    // console.log(`Timer: ${timerCountdown} seconds remaining`);
    timerCountdown--;
    // Emit the timer countdown to all connected clients
    io.emit("timerUpdate", { countdown: timerCountdown });
    if (timerCountdown < 0) {
      clearInterval(timerId);
      displayDataAndRestartTimer();
    }
  }, 1000);
};
startTimer();

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected");

  // Send initial data and timer countdown to the client when connected
  RandomData.findOne({}, {}, { sort: { created_at: -1 } }, (err, data) => {
    if (data) {
      socket.emit("initialData", data);
    }

    // Emit the initial timer countdown to the client
    socket.emit("timerUpdate", { countdown: 3 * 60 }); // Initial countdown value
  });
});

// 3Minutes Game COde
// Pagination endpoint
//1Minutes Game COde
app.get("/api/randomData1", async (req, res) => {
  const perPage = 15;
  const page = req.query.page || 1;

  try {
    const data = await RandomData1.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalDocuments = await RandomData1.countDocuments();
    const totalPages = Math.ceil(totalDocuments / perPage);

    res.json({
      data,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// const getRandomValue1 = (array) => {
//   const randomIndex = Math.floor(Math.random() * array.length);
//   return array[randomIndex];
// };

// const generateAndSaveRandomData1 = async () => {
//   try {
//     const randomColor = getRandomValue1(["Violet", "Red", "Green"]);
//     // const randomNumber = getRandomValue1(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
//     // const randomLetter = getRandomValue1(["Small", "Big"]);
// const randomNumber = getRandomValue1(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

// let randomLetter;

// if (parseInt(randomNumber) >= 0 && parseInt(randomNumber) <= 4) {
//   randomLetter = getRandomValue1(["Small"]);
// } else if (parseInt(randomNumber) >= 5 && parseInt(randomNumber) <= 9) {
//   randomLetter = getRandomValue1(["Big"]);
// } else {
//   // Handle unexpected cases
//   console.error("Unexpected value for randomNumber");
// }

//     // Generate the session information
//     const currentDate = new Date();
//     const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get current month with leading zero
//     const currentDay = currentDate.getDate().toString().padStart(2, '0'); // Get current day with leading zero
//     const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0'); // Get current minutes with leading zero
//     const sessionPrefix = 'PI11123';
//     const session = `${sessionPrefix}${currentMonth}${currentDay}00${currentMinutes}`;

//     const newData = new RandomData1({
//       color: randomColor,
//       letter: randomLetter,
//       number: randomNumber,
//       session: session,
//     });

//     await newData.save();

//     // console.log('Generated and saved random data:', newData);

//     // Emit the new data to all connected clients
//     io.emit('newData1', newData);

//     return newData;
//   } catch (error) {
//     // console.error('Error generating and saving random data:', error);
//     throw error;
//   }
// };

// const displayDataAndRestartTimer1 = async () => {
//   try {
//     const newData = await generateAndSaveRandomData1();
//     // console.log(`Generated and saved random data after timer end:`, newData);

//     // Auto-restart the timer for 3 minutes
//     startTimer1();
//   } catch (error) {
//     // console.error('Error fetching and saving random data after timer end:', error);
//     // Log the error and continue; you might want to handle this more gracefully
//   }
// };

// const startTimer1 = () => {
//   let timerCountdown1 = 1 * 60; // 3 minutes

//   const timerId1 = setInterval(async () => {
//     try {
//       const response = await axios.post('https://mlm-production.up.railway.app/api/generateRandomData1');
//       console.log('Automatic API call successful:', response.data);

//       console.log(`Color: ${response.data.data.color}, Letter: ${response.data.data.letter}, Number: ${response.data.data.number}`);

//       timerCountdown1 = 1 * 60; // Restart the timer

//       // Emit the timer countdown to all connected clients
//       io.emit('timerUpdate1', { countdown: timerCountdown1 });
//     } catch (error) {
//       // console.error('Error making automatic API call:', error.message);
//     //   Log the error and continue; you might want to handle this more gracefully
//     }

//     // console.log(`Timer: ${timerCountdown1} seconds remaining`);
//     timerCountdown1--;
//  // Emit the timer countdown to all connected clients
//  io.emit('timerUpdate1', { countdown: timerCountdown1 });
//     if (timerCountdown1 < 0) {
//       clearInterval(timerId1);
//       displayDataAndRestartTimer1();
//     }
//   }, 1000);
// };
// startTimer1();

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // Send initial data and timer countdown to the client when connected
//   RandomData1.findOne({}, {}, { sort: { 'created_at': -1 } }, (err, data) => {
//     if (data) {
//       socket.emit('initialData1', data);
//     }

//     // Emit the initial timer countdown to the client
//     socket.emit('timerUpdate1', { countdown: 1 * 60 }); // Initial countdown value
//   });
// });

// 1Minutes Game COde
// New 1Minutes updated code
// const generateAndSaveRandomData1 = async () => {
//   try {
//     const currentDate1 = new Date();
//     const currentMinutes1 = currentDate1.getMinutes();

//     // Check if data has already been saved in the current minute
//     if (dataSavedThisMinute && currentMinutes1 === lastSaveMinute) {
//       console.log('Data already saved in this minute. Skipping...');
//       return null; // Skip saving data if it has already been saved in this minute
//     }

//     const randomColor = getRandomValue1(["Violet", "Red", "Green"]);
//     const randomNumber = getRandomValue1(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

//     let randomLetter;

//     if (parseInt(randomNumber) >= 0 && parseInt(randomNumber) <= 4) {
//       randomLetter = getRandomValue1(["Small"]);
//     } else if (parseInt(randomNumber) >= 5 && parseInt(randomNumber) <= 9) {
//       randomLetter = getRandomValue1(["Big"]);
//     } else {
//       console.error("Unexpected value for randomNumber");
//     }

//     const currentDate = new Date();
//     const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//     const currentDay = currentDate.getDate().toString().padStart(2, '0');
//     const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
//     const sessionPrefix = 'PI2223';
//     const session = `${sessionPrefix}${currentMonth}${currentDay}00${currentMinutes}`;

//     const newData = new RandomData1({
//       color: randomColor,
//       letter: randomLetter,
//       number: randomNumber,
//       session: session,
//     });

//     // Save the data to the database
//     await newData.save();

//     // Set the flag to true, indicating that data has been saved in the current minute
//     dataSavedThisMinute = true;
//     lastSaveMinute = currentMinutes;

//     // console.log(`Color: ${newData.color}, Letter: ${newData.letter}, Number: ${newData.number}`);

//     return newData;
//   } catch (error) {
//     throw error;
//   }
// };

// Testing Code start
// const getRandomValue1 = (array) => {
//   const randomIndex = Math.floor(Math.random() * array.length);
//   return array[randomIndex];
// };
let dataSavedThisMinute = false;
let lastSaveMinute;

// let sessionCounter = 0;

// const generateAndSaveRandomData1 = async () => {
//   try {
//     const currentDate1 = new Date();
//     const currentMinutes1 = currentDate1.getMinutes();

//     // Check if data has already been saved in the current minute
//     if (dataSavedThisMinute && currentMinutes1 === lastSaveMinute) {
//       console.log('Data already saved in this minute. Skipping...');
//       return null; // Skip saving data if it has already been saved in this minute
//     }    

//     const randomColor = getRandomValue1(["Violet", "Red", "Green"]);
//     const randomNumber = getRandomValue1(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

//     let randomLetter;

//     if (parseInt(randomNumber) >= 0 && parseInt(randomNumber) <= 4) {
//       randomLetter = getRandomValue1(["Small"]);
//     } else if (parseInt(randomNumber) >= 5 && parseInt(randomNumber) <= 9) {
//       randomLetter = getRandomValue1(["Big"]);
//     } else {
//       console.error("Unexpected value for randomNumber");
//     }

//     const currentDate = new Date();
//     const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//     const currentDay = currentDate.getDate().toString().padStart(2, '0');
//     const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
//     const sessionPrefix = 'PI';
    
//     // Increment the session counter and format it with leading zeros
//     sessionCounter++;
//     const sessionNumber = sessionCounter.toString().padStart(4, '0');
    
//     const session = `${sessionPrefix}${currentMonth}${currentDay}${currentMinutes}${sessionNumber}`;

//     const newData = new RandomData1({
//       color: randomColor,
//       letter: randomLetter,
//       number: randomNumber,
//       session: session,
//     });

//     // Save the data to the database
//     await newData.save();

//     // Set the flag to true, indicating that data has been saved in the current minute
//     dataSavedThisMinute = true;
//     lastSaveMinute = currentMinutes;

//     // console.log(`Color: ${newData.color}, Letter: ${newData.letter}, Number: ${newData.number}`);

//     return newData;
//   } catch (error) {
//     throw error;
//   }
// };

// let timerStartTime1 = new Date().getTime(); // Store the start time of the timer
const getRandomValue1 = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const savedSessionsThisMinute = new Map();
let sessionCounter = 0;

const generateAndSaveRandomData1 = async () => {
  try {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
    const sessionPrefix = 'PI';
    
    // Increment the session counter and format it with leading zeros
    sessionCounter++;
    const sessionNumber = sessionCounter.toString().padStart(6, '0');
    
    const session = `${sessionPrefix}${currentMonth}${currentDay}${sessionNumber}`;

    // Check if the session has already been saved in the current minute
    if (savedSessionsThisMinute.has(session)) {
      console.log('Session already saved in this minute. Skipping...');
      return null; // Skip saving data if the session has already been saved
    }

    // Check if the session has been saved in the last 2 minutes in the database
    const twoMinutesAgo = new Date(currentDate.getTime() - 1 * 60 * 1000); // 2 minutes ago
    const existingSession = await RandomData1.findOne({
      session: session,
      createdAt: { $gte: twoMinutesAgo },
    });

    if (existingSession) {
      console.log('Session already saved in the last 2 minutes. Skipping...');
      savedSessionsThisMinute.set(session, true);
      return null; // Skip saving data if the session has been saved in the last 2 minutes
    }

    const randomColor = getRandomValue1(["Violet", "Red", "Green"]);
    const randomNumber = getRandomValue1(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

    let randomLetter;
    if (parseInt(randomNumber) >= 0 && parseInt(randomNumber) <= 4) {
      randomLetter = getRandomValue1(["Small"]);
    } else if (parseInt(randomNumber) >= 5 && parseInt(randomNumber) <= 9) {
      randomLetter = getRandomValue1(["Big"]);
    } else {
      console.error("Unexpected value for randomNumber");
    }

    const newData = new RandomData1({
      color: randomColor,
      letter: randomLetter,
      number: randomNumber,
      session: session,
    });

    // Save the data to the database
    await newData.save();

    // Add the session to the map to indicate that it has been saved in this minute
    savedSessionsThisMinute.set(session, true);

    return newData;
  } catch (error) {
    throw error;
  }
};


let timerStartTime1 = new Date().getTime(); // Store the start time of the timer

const displayDataAndRestartTimer1 = async () => {
  try {
    // Calculate the remaining time
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - timerStartTime1) / 1000);
    const remainingTime = Math.max(0, 60 - elapsedTime); // Adjust as needed

    io.emit('timerUpdate1', { countdown: remainingTime });

    if (remainingTime === 0) {
      const newData2 = await generateAndSaveRandomData1();

      // Emit the data to all connected clients
      io.emit('newData1', newData2);

      // console.log(`Color: ${newData2.color}, Letter: ${newData2.letter}, Number: ${newData2.number}`);
    }

    // Reset the flag when the timer is restarted
    dataSavedThisMinute = false;
    timerStartTime1 = currentTime; // Update the timer start time

    startTimer1();
  } catch (error) {
    // Handle error
  }
};





const startTimer1 = () => {
  let timerCountdown1 = 60; // Initial countdown value in seconds

  const handleTimerTick = async () => {
    try {
      const response = await axios.post('https://mlm-production.up.railway.app/api/generateRandomData1');
      console.log('Automatic API call successful:', response.data);

      // console.log(`Color: ${response.data.data.color}, Letter: ${response.data.data.letter}, Number: ${response.data.data.number}`);

      // Emit the timer countdown to all connected clients
      io.emit('timerUpdate1', { countdown: timerCountdown1 });
    } catch (error) {
      // Handle error
    }
  };

  // Initial tick to set up the timer
  handleTimerTick();

  const timerId1 = setInterval(async () => {
    timerCountdown1--;

    // Emit the timer countdown to all connected clients
    io.emit('timerUpdate1', { countdown: timerCountdown1 });

    if (timerCountdown1 <= 0) {
      clearInterval(timerId1);
      timerCountdown1 = 60; // Reset the countdown to 60 seconds

      // Call displayDataAndRestartTimer1 only when the timer completes
      await displayDataAndRestartTimer1();
    }
  }, 1000); // Run every 1 second
};


startTimer1();

io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial data and timer countdown to the client when connected
  RandomData1.findOne({}, {}, { sort: { 'created_at': -1 } }, (err, data) => {
    if (data) {
      socket.emit('initialData1', data);
    }

    // Emit the initial timer countdown to the client
    socket.emit('timerUpdate1', { countdown: 60 }); // Initial countdown value
  });
});

//Testing Code End



// New 1Minutes updated code End
// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});
   
// Start server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
