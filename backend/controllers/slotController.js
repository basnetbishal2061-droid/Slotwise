const Slot = require('../models/Slot');

// @desc  Get available slots, optionally filter by date
// @route GET /api/slots?date=YYYY-MM-DD
const getSlots = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;
    const slots = await Slot.find(filter).sort({ date: 1, time: 1 });
    res.json(slots);
  } catch (error) {
    next(error);
  }
};

// @desc  Create a new slot (admin)
// @route POST /api/slots
const createSlot = async (req, res, next) => {
  try {
    const { date, time, service, duration } = req.body;
    const exists = await Slot.findOne({ date, time });
    if (exists) return res.status(400).json({ message: 'Slot already exists' });

    const slot = await Slot.create({ date, time, service, duration });
    res.status(201).json(slot);
  } catch (error) {
    next(error);
  }
};

// @desc  Bulk create slots for a date (admin)
// @route POST /api/slots/bulk
const createBulkSlots = async (req, res, next) => {
  try {
    const { date, times, service, duration } = req.body;
    if (!date || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ message: 'Date and times array are required' });
    }
    const docs = times.map((time) => ({ date, time, service, duration }));
    const created = await Slot.insertMany(docs, { ordered: false }).catch((e) => e);
    res.status(201).json({ message: 'Slots processed', created: docs.length });
  } catch (error) {
    next(error);
  }
};

// @desc  Block/unblock a slot (admin)
// @route PUT /api/slots/:id/block
const toggleBlockSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    slot.isBlocked = !slot.isBlocked;
    await slot.save();
    res.json(slot);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a slot (admin)
// @route DELETE /api/slots/:id
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Cannot delete a booked slot' });
    await slot.deleteOne();
    res.json({ message: 'Slot removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSlots, createSlot, createBulkSlots, toggleBlockSlot, deleteSlot };
