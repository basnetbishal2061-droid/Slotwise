const express = require('express');
const router = express.Router();
const { getSummary, getAppointmentsByDate } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/summary', protect, adminOnly, getSummary);
router.get('/by-date', protect, adminOnly, getAppointmentsByDate);

module.exports = router;
