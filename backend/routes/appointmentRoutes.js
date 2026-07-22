const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelMyAppointment,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/', protect, adminOnly, getAllAppointments);
router.put('/:id/status', protect, adminOnly, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelMyAppointment);

module.exports = router;
