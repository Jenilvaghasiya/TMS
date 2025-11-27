const { Task, TaskAssignment, User, TaskUpdate } = require('../models');
const { Op } = require('sequelize');
const { validateTaskData } = require('../utils/validation');

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;

    // Validate input
    const errors = validateTaskData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      createdBy: req.user.id
    });

    if (assignedTo && assignedTo.length > 0) {
      const assignments = assignedTo.map(userId => ({
        taskId: task.id,
        userId
      }));
      await TaskAssignment.bulkCreate(assignments);
    }

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        },
        {
          model: User,
          as: 'assignedUsers',
          attributes: ['id', 'fullName', 'username'],
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: 'assignedUsers',
          where: { id: req.user.id },
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName']
        },
        {
          model: TaskUpdate,
          as: 'updates',
          required: false,
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'fullName']
          }],
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Ensure attachments is always an array for all tasks
    const tasksWithSafeAttachments = tasks.map(task => {
      const taskData = task.toJSON();
      if (taskData.updates) {
        taskData.updates = taskData.updates.map(update => ({
          ...update,
          attachments: Array.isArray(update.attachments) ? update.attachments : []
        }));
      }
      return taskData;
    });

    res.json(tasksWithSafeAttachments);
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'username']
        },
        {
          model: User,
          as: 'assignedUsers',
          attributes: ['id', 'fullName', 'username'],
          through: { attributes: [] }
        },
        {
          model: TaskUpdate,
          as: 'updates',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'fullName']
          }],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure attachments is always an array
    if (task.updates) {
      task.updates = task.updates.map(update => {
        const updateData = update.toJSON();
        updateData.attachments = Array.isArray(updateData.attachments) ? updateData.attachments : [];
        return updateData;
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, status, assignedTo } = req.body;

    // Validate input
    const errors = validateTaskData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ title, description, priority, dueDate, status });

    if (assignedTo) {
      await TaskAssignment.destroy({ where: { taskId: id } });
      const assignments = assignedTo.map(userId => ({
        taskId: id,
        userId
      }));
      await TaskAssignment.bulkCreate(assignments);
    }

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await TaskAssignment.destroy({ where: { taskId: id } });
    await TaskUpdate.destroy({ where: { taskId: id } });
    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
