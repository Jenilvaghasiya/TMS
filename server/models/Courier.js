const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Function to generate unique tracking number
const generateTrackingNumber = () => {
  const prefix = 'TRK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

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
    unique: true
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
  timestamps: true,
  hooks: {
    beforeCreate: async (courier) => {
      // Auto-generate tracking number if not provided
      if (!courier.trackingNumber) {
        let isUnique = false;
        let trackingNumber;
        
        while (!isUnique) {
          trackingNumber = generateTrackingNumber();
          const existing = await Courier.findOne({ where: { trackingNumber } });
          if (!existing) {
            isUnique = true;
          }
        }
        
        courier.trackingNumber = trackingNumber;
      }
    }
  }
});

module.exports = Courier;
