// const express = require('express');
// const taskController = require('../controllers/taskController');

// const router = express.Router();

// router.get('/', taskController.getAllTasks);
// router.get('/:id', taskController.getTasks);
// router.post('/', taskController.createTask);
// router.delete('/:id', taskController.deleteTask);

// module.exports = router;




// taskRoute.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Route to get all tasks
router.get('/tasks', taskController.getAllTasks);

// Route to get a single task by taskId
router.get('/tasks/:id', taskController.getTaskById);

// Route to create a new task
router.post('/tasks', taskController.createTask);

// Route to mark a task as completed by taskId
router.patch('/tasks/:id/complete', taskController.markTaskCompleted);

// Route to delete a task by taskId
router.delete('/tasks/:id', taskController.deleteTask);
// New route to delete all tasks
router.delete('/tasks', taskController.deleteAllTasks);
// Route to fetch task Report 
router.get('/user/:userId/taskStatus',taskController.taskCompletionStatus)
module.exports = router;

