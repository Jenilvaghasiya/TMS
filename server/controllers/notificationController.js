const { Task, User, TaskUpdate } = require('../models');
const { Op } = require('sequelize');
const { sendTaskReminder, sendDailyReport, sendWeeklyReport } = require('../utils/emailService');

// Send reminder for pending tasks
exports.sendPendingTaskReminders = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'Employee' },
      include: [{
        model: Task,
        as: 'assignedTasks',
        where: {
          status: { [Op.in]: ['Pending', 'In-Progress'] },
          dueDate: { [Op.gte]: new Date() }
        },
        required: false
      }]
    });

    const results = [];
    for (const user of users) {
      if (user.assignedTasks && user.assignedTasks.length > 0) {
        const result = await sendTaskReminder(user.email, user.fullName, user.assignedTasks);
        results.push({ user: user.fullName, ...result });
      }
    }

    res.json({ 
      message: 'Reminders sent', 
      results,
      totalSent: results.filter(r => r.success).length 
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send daily report to a specific user
exports.sendDailyReportToUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's task statistics
    const tasks = await Task.findAll({
      include: [{
        model: User,
        as: 'assignedUsers',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }]
    });

    const stats = {
      totalTasks: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In-Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date()).length
    };

    const result = await sendDailyReport(user.email, user.fullName, stats);
    
    if (result.success) {
      res.json({ message: 'Daily report sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send report', error: result.message });
    }
  } catch (error) {
    console.error('Send daily report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send weekly report to a specific user
exports.sendWeeklyReportToUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get user's task statistics for the week
    const tasks = await Task.findAll({
      include: [{
        model: User,
        as: 'assignedUsers',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }]
    });

    const completedThisWeek = await Task.count({
      where: {
        status: 'Completed',
        updatedAt: { [Op.gte]: oneWeekAgo }
      },
      include: [{
        model: User,
        as: 'assignedUsers',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }]
    });

    const taskUpdates = await TaskUpdate.findAll({
      where: {
        userId: userId,
        createdAt: { [Op.gte]: oneWeekAgo }
      }
    });

    const totalHours = taskUpdates.reduce((sum, update) => sum + parseFloat(update.hoursWorked || 0), 0);
    const productivity = tasks.length > 0 ? Math.round((completedThisWeek / tasks.length) * 100) : 0;

    const stats = {
      totalTasks: tasks.length,
      completedThisWeek,
      pending: tasks.filter(t => t.status === 'Pending').length,
      totalHours: totalHours.toFixed(2),
      productivity
    };

    const result = await sendWeeklyReport(user.email, user.fullName, stats);
    
    if (result.success) {
      res.json({ message: 'Weekly report sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send report', error: result.message });
    }
  } catch (error) {
    console.error('Send weekly report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get report statistics (without sending email)
exports.getReportStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.query; // 'daily' or 'weekly'

    const tasks = await Task.findAll({
      include: [{
        model: User,
        as: 'assignedUsers',
        where: { id: userId },
        attributes: [],
        through: { attributes: [] }
      }]
    });

    if (period === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const completedThisWeek = tasks.filter(t => 
        t.status === 'Completed' && new Date(t.updatedAt) >= oneWeekAgo
      ).length;

      const taskUpdates = await TaskUpdate.findAll({
        where: {
          userId: userId,
          createdAt: { [Op.gte]: oneWeekAgo }
        }
      });

      const totalHours = taskUpdates.reduce((sum, update) => sum + parseFloat(update.hoursWorked || 0), 0);
      const productivity = tasks.length > 0 ? Math.round((completedThisWeek / tasks.length) * 100) : 0;

      res.json({
        period: 'weekly',
        totalTasks: tasks.length,
        completedThisWeek,
        pending: tasks.filter(t => t.status === 'Pending').length,
        inProgress: tasks.filter(t => t.status === 'In-Progress').length,
        totalHours: totalHours.toFixed(2),
        productivity
      });
    } else {
      // Daily stats
      res.json({
        period: 'daily',
        totalTasks: tasks.length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        inProgress: tasks.filter(t => t.status === 'In-Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        overdue: tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date()).length
      });
    }
  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
