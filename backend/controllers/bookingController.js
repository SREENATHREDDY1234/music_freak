const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// Create booking
exports.createBooking = async (req, res) => {
  try { 
    const { user, eventId, tickets } = req.body;

    // Validate user and tickets
    if (!user) return res.status(400).json({ error: 'User is required' });
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: 'Tickets are required and must be an array' });
    }

    // 1. Find event with ticket availability
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // 2. Validate & calculate total
    let totalAmount = 0;
    for (const { ticketType, quantity } of tickets) {
      const ticket = event.ticketTypes.find(t=>t._id.toString() === ticketType);
      
      if (!ticket || ticket.available < quantity) {
        return res.status(400).json({ error: `Insufficient ${ticketType} tickets` });
      }
      totalAmount += ticket.price * quantity;
    }

    // 3. Update availability
    for (const { ticketType, quantity } of tickets) {
      const ticketIndex = event.ticketTypes.findIndex(t => t._id.toString() === ticketType);
      event.ticketTypes[ticketIndex].available -= quantity;
    }

    // 4. Create booking
    const booking = await Booking.create({
      user,
      event: eventId,
      tickets: tickets,
      totalAmount,
      paymentStatus: 'Completed'
    });
    
    await event.save();

    // 5. Update user
    await User.findByIdAndUpdate(user, { $push: { bookings: booking._id } });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await User.findById(req.params.userId)
      .populate('bookings')
      .select('bookings');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Restore ticket availability
    for (const item of booking.tickets) {
      const eventId = booking.event;
      const event = await Event.findById(eventId);
      const ticketIndex = event.ticketTypes.findIndex(t => t._id.toString() === item.ticketType.toString());
      event.ticketTypes[ticketIndex].available += item.quantity;
    }

    // Delete booking
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking canceled' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};