const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const profileRoutes = require('./routes/profile');
const passwordRoute = require('./routes/passwordReset');
const register = require('./routes/register');
const taskRoutes = require('./routes/taskRoute')
const userTaskRoute = require('./routes/userTaskRoute')
const fileUpload = require("express-fileupload");
// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to MongoDB'))
    
    .catch((error) => console.error(error));
  // Middleware
  app.use(cors({
    origin:"http://localhost:3000"
    // origin:"https://globalsuccesspoint.netlify.app"
    // origin:"https://globalsuccesspoint.in"
  }));
  app.use(express.json());
  app.use(fileUpload())
// error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
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
app.use('/api', require('./routes/withdraw'));
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
app.use('/api',require('./routes/GameDeposit'));
   // Admin 
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error');
  });
  
  // 
  
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  