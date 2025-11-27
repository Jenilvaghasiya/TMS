const User = require('./User');
const Task = require('./Task');
const TaskAssignment = require('./TaskAssignment');
const TaskUpdate = require('./TaskUpdate');
const Courier = require('./Courier');

// Define associations
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Task.belongsToMany(User, { through: TaskAssignment, foreignKey: 'taskId', as: 'assignedUsers' });
User.belongsToMany(Task, { through: TaskAssignment, foreignKey: 'userId', as: 'assignedTasks' });

TaskAssignment.belongsTo(Task, { foreignKey: 'taskId' });
TaskAssignment.belongsTo(User, { foreignKey: 'userId' });
Task.hasMany(TaskAssignment, { foreignKey: 'taskId' });
User.hasMany(TaskAssignment, { foreignKey: 'userId' });

Task.hasMany(TaskUpdate, { foreignKey: 'taskId', as: 'updates' });
TaskUpdate.belongsTo(Task, { foreignKey: 'taskId' });

User.hasMany(TaskUpdate, { foreignKey: 'userId', as: 'taskUpdates' });
TaskUpdate.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Courier, { foreignKey: 'createdBy', as: 'couriers' });
Courier.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  User,
  Task,
  TaskAssignment,
  TaskUpdate,
  Courier
};
