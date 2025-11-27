const { Courier, User } = require('../models');
const { Op } = require('sequelize');
const { validateCourierData } = require('../utils/validation');

exports.createCourier = async (req, res) => {
  try {
    const { senderName, receiverName, courierType, trackingNumber, remarks, status } = req.body;

    // Basic validation
    if (!senderName || senderName.trim().length < 2 || senderName.trim().length > 50) {
      return res.status(400).json({ message: 'Sender name must be 2-50 characters' });
    }

    if (!receiverName || receiverName.trim().length < 2 || receiverName.trim().length > 50) {
      return res.status(400).json({ message: 'Receiver name must be 2-50 characters' });
    }

    if (!courierType || courierType.trim().length < 2 || courierType.trim().length > 50) {
      return res.status(400).json({ message: 'Courier type must be 2-50 characters' });
    }

    // Tracking number is required
    if (!trackingNumber || trackingNumber.trim().length < 3) {
      return res.status(400).json({ message: 'Tracking number is required (minimum 3 characters)' });
    }

    // Check if tracking number already exists
    const existing = await Courier.findOne({ where: { trackingNumber: trackingNumber.trim() } });
    if (existing) {
      return res.status(400).json({ message: 'Tracking number already exists' });
    }

    const courier = await Courier.create({
      senderName: senderName.trim(),
      receiverName: receiverName.trim(),
      courierType: courierType.trim(),
      trackingNumber: trackingNumber.trim(),
      remarks: remarks ? remarks.trim() : null,
      status: status || 'Received',
      createdBy: req.user.id
    });

    res.status(201).json({ 
      message: 'Courier entry created successfully', 
      data: courier,
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
    const { senderName, receiverName, courierType, status, deliveredDate, remarks } = req.body;

    const courier = await Courier.findByPk(id);
    
    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }

    // Prepare update data
    const updateData = {};

    // If updating courier details (not just status)
    if (senderName || receiverName || courierType) {
      const courierData = {
        senderName: senderName || courier.senderName,
        receiverName: receiverName || courier.receiverName,
        courierType: courierType || courier.courierType,
        status: status || courier.status
      };
      
      const errors = validateCourierData(courierData);
      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(', ') });
      }

      if (senderName) updateData.senderName = senderName.trim();
      if (receiverName) updateData.receiverName = receiverName.trim();
      if (courierType) updateData.courierType = courierType.trim();
    }

    // Validate status if provided
    if (status && !['Received', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Received or Delivered' });
    }

    if (status) updateData.status = status;
    if (deliveredDate) updateData.deliveredDate = deliveredDate;
    if (remarks !== undefined) updateData.remarks = remarks ? remarks.trim() : null;

    await courier.update(updateData);

    res.json({ message: 'Courier updated successfully', data: courier });
  } catch (error) {
    console.error('Update courier error:', error);
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
