// userTasks.js
const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

const UserTask = mongoose.model('UserTask', userTaskSchema);

module.exports = UserTask;
