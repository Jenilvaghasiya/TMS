const { Task, User, TaskAssignment, Courier } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalTasks = await Task.count();
    const pendingTasks = await Task.count({ where: { status: 'Pending' } });
    const inProgressTasks = await Task.count({ where: { status: 'In-Progress' } });
    const completedTasks = await Task.count({ where: { status: 'Completed' } });
    
    const overdueTasks = await Task.count({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'Completed' }
      }
    });

    const totalEmployees = await User.count({ where: { role: 'employee', isActive: true } });

    const employeeProductivity = await User.findAll({
      where: { role: 'employee', isActive: true },
      attributes: [
        'id',
        'fullName',
        [sequelize.fn('COUNT', sequelize.col('assignedTasks.id')), 'totalTasks'],
        [sequelize.literal(`SUM(CASE WHEN assignedTasks.status = 'Completed' THEN 1 ELSE 0 END)`), 'completedTasks']
      ],
      include: [{
        model: Task,
        as: 'assignedTasks',
        attributes: [],
        through: { attributes: [] },
        required: false
      }],
      group: ['User.id'],
      raw: true
    });

    const recentTasks = await Task.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'creator',
        attributes: ['fullName']
      }]
    });

    res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      totalEmployees,
      employeeProductivity,
      recentTasks
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const assignments = await TaskAssignment.findAll({
      where: { userId },
      include: [{
        model: Task,
        required: true
      }]
    });

    const tasks = assignments.map(a => a.Task);

    const stats = {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'Pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'In-Progress').length,
      completedTasks: tasks.filter(t => t.status === 'Completed').length,
      overdueTasks: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Employee dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
