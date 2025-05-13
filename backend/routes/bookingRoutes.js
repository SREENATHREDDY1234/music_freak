const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking
} = require('../controllers/bookingController');

// Protected user routes
router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.delete('/:id', cancelBooking);



module.exports = router;