const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, isAdmin } = require('../middleware/auth');

// Admin: Send reminders to all employees with pending tasks
router.post('/send-reminders', auth, isAdmin, notificationController.sendPendingTaskReminders);

// User: Send daily report to self
router.post('/daily-report', auth, notificationController.sendDailyReportToUser);

// User: Send weekly report to self
router.post('/weekly-report', auth, notificationController.sendWeeklyReportToUser);

// User: Get report statistics
router.get('/report-stats', auth, notificationController.getReportStats);

module.exports = router;
