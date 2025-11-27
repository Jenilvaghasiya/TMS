const { TaskUpdate, Task, User } = require('../models');
const { validateTaskUpdateData } = require('../utils/validation');

exports.addTaskUpdate = async (req, res) => {
  try {
    const { taskId, comment, status, hoursWorked } = req.body;

    // Validate input
    const errors = validateTaskUpdateData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Handle file attachments
    const attachments = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size
    })) : [];

    const update = await TaskUpdate.create({
      taskId,
      userId: req.user.id,
      comment,
      status,
      hoursWorked: hoursWorked || 0,
      attachments
    });

    await task.update({ status });

    const updateWithUser = await TaskUpdate.findByPk(update.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName']
      }]
    });

    res.status(201).json({ message: 'Task update added successfully', update: updateWithUser });
  } catch (error) {
    console.error('Add task update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskUpdates = async (req, res) => {
  try {
    const { taskId } = req.params;

    const updates = await TaskUpdate.findAll({
      where: { taskId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
