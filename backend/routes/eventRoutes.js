const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getNearbyEvents
} = require('../controllers/eventController');

// Public routes
router.get('/', getAllEvents);
router.get('/nearby', getNearbyEvents); // /api/events/nearby?lat=...&lng=...&distance=...
router.get('/:id', getEventById);

// Protected admin routes
router.post('/', authenticate, authorize(['admin']), createEvent);
router.put('/:id', authenticate, authorize(['admin']), updateEvent);
router.delete('/:id', authenticate, authorize(['admin']), deleteEvent);

module.exports = router;