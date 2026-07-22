const express = require('express');
const router = express.Router();
const {
  getSlots,
  createSlot,
  createBulkSlots,
  toggleBlockSlot,
  deleteSlot,
} = require('../controllers/slotController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getSlots);
router.post('/', protect, adminOnly, createSlot);
router.post('/bulk', protect, adminOnly, createBulkSlots);
router.put('/:id/block', protect, adminOnly, toggleBlockSlot);
router.delete('/:id', protect, adminOnly, deleteSlot);

module.exports = router;
