const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/', auth, isAdmin, taskController.createTask);
router.get('/', auth, taskController.getAllTasks);
router.get('/my-tasks', auth, taskController.getMyTasks);
router.get('/:id', auth, taskController.getTaskById);
router.put('/:id', auth, isAdmin, taskController.updateTask);
router.delete('/:id', auth, isAdmin, taskController.deleteTask);

module.exports = router;
