const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Courier = sequelize.define('Courier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  senderName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  receiverName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  courierType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  status: {
    type: DataTypes.ENUM('Received', 'Delivered'),
    defaultValue: 'Received'
  },
  receivedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deliveredDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Courier;
