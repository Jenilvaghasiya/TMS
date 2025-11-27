const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/admin', auth, isAdmin, dashboardController.getAdminDashboard);
router.get('/employee', auth, dashboardController.getEmployeeDashboard);

module.exports = router;
