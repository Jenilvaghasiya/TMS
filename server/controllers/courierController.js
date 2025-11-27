const { Courier, User } = require('../models');
const { Op } = require('sequelize');
const { validateCourierData } = require('../utils/validation');

exports.createCourier = async (req, res) => {
  try {
    const { senderName, receiverName, courierType, trackingNumber, remarks, status } = req.body;

    // Validate input
    const courierData = {
      senderName,
      receiverName,
      courierType,
      trackingNumber,
      status: status || 'Received'
    };
    
    const errors = validateCourierData(courierData);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(', ') });
    }

    // Check if tracking number already exists (if provided)
    if (trackingNumber) {
      const existing = await Courier.findOne({ where: { trackingNumber } });
      if (existing) {
        return res.status(400).json({ message: 'Tracking number already exists' });
      }
    }

    const courier = await Courier.create({
      senderName: senderName.trim(),
      receiverName: receiverName.trim(),
      courierType: courierType.trim(),
      trackingNumber: trackingNumber ? trackingNumber.trim() : null,
      remarks: remarks ? remarks.trim() : null,
      createdBy: req.user.id
    });

    res.status(201).json({ 
      message: 'Courier entry created successfully', 
      courier,
      trackingNumber: courier.trackingNumber
    });
  } catch (error) {
    console.error('Create courier error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCouriers = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let where = {};
    
    if (search) {
      where[Op.or] = [
        { senderName: { [Op.like]: `%${search}%` } },
        { receiverName: { [Op.like]: `%${search}%` } },
        { trackingNumber: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const couriers = await Courier.findAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'fullName']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(couriers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCourier = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveredDate, remarks } = req.body;

    // Validate status
    if (status && !['Received', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Received or Delivered' });
    }

    const courier = await Courier.findByPk(id);
    
    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }

    await courier.update({ status, deliveredDate, remarks });

    res.json({ message: 'Courier updated successfully', courier });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCourier = async (req, res) => {
  try {
    const { id } = req.params;
    
    const courier = await Courier.findByPk(id);
    
    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }

    await courier.destroy();

    res.json({ message: 'Courier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
