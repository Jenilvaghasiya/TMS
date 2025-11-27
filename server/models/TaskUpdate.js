const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TaskUpdate = sequelize.define('TaskUpdate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In-Progress', 'Completed'),
    allowNull: false
  },
  attachments: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('attachments');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('attachments', JSON.stringify(value));
    }
  },
  hoursWorked: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = TaskUpdate;
