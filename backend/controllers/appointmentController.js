const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');

// @desc  Book an appointment
// @route POST /api/appointments
const bookAppointment = async (req, res, next) => {
  try {
    const { slotId, service, notes } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked || slot.isBlocked) {
      return res.status(400).json({ message: 'This slot is not available' });
    }

    const appointment = await Appointment.create({
      customer: req.user._id,
      slot: slot._id,
      date: slot.date,
      time: slot.time,
      service: service || slot.service,
      notes,
    });

    slot.isBooked = true;
    await slot.save();

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in user's appointments (history)
// @route GET /api/appointments/my
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ customer: req.user._id })
      .populate('slot')
      .sort({ date: -1, time: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all appointments (admin), filter by date/status
// @route GET /api/appointments
const getAllAppointments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate('customer', 'name email phone')
      .populate('slot')
      .sort({ date: -1, time: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc  Update appointment status (admin)
// @route PUT /api/appointments/:id/status
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    if (status === 'cancelled' || status === 'rejected') {
      await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc  Cancel own appointment (customer)
// @route PUT /api/appointments/:id/cancel
const cancelMyAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false });

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelMyAppointment,
};
