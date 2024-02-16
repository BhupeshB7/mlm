const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const cron = require("node-cron");
const schedule = require('node-schedule');
const http = require("http");
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


// Middleware
// app.use(cors());
app.use(
  cors({
    // origin:"https://powerfullindia.com",
    origin:"https://www.powerfullindia.com",
    // origin: "*",
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
app.use("/server",(req,res)=>{
  res.json({message:"Server Started!"});
})
// Schedule daily income reset using cron
cron.schedule(
  "35 23 * * *",
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



  
// Start server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
