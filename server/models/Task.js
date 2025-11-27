const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In-Progress', 'Completed'),
    defaultValue: 'Pending'
  },
  dueDate: {
    type: DataTypes.DATE,
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
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Task;
