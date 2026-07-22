const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Slot = require('../models/Slot');

// @desc  Dashboard summary stats (admin)
// @route GET /api/reports/summary
const getSummary = async (req, res, next) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalSlots = await Slot.countDocuments();

    const statusCounts = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusBreakdown = { pending: 0, approved: 0, rejected: 0, cancelled: 0, completed: 0 };
    statusCounts.forEach((s) => {
      statusBreakdown[s._id] = s.count;
    });

    const today = new Date().toISOString().slice(0, 10);
    const todaysAppointments = await Appointment.countDocuments({ date: today });

    res.json({
      totalAppointments,
      totalCustomers,
      totalSlots,
      todaysAppointments,
      statusBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Appointments grouped by date (for charts)
// @route GET /api/reports/by-date
const getAppointmentsByDate = async (req, res, next) => {
  try {
    const results = await Appointment.aggregate([
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(results.map((r) => ({ date: r._id, count: r.count })));
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getAppointmentsByDate };
