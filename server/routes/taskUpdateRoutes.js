const express = require('express');
const router = express.Router();
const taskUpdateController = require('../controllers/taskUpdateController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('attachments', 5), taskUpdateController.addTaskUpdate);
router.get('/:taskId', auth, taskUpdateController.getTaskUpdates);

module.exports = router;
