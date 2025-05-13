const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  tickets: [{
    ticketType: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event.ticketTypes', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed'], 
    default: 'Pending' 
  }
},{ timestamps: true });

//Index for faster search
bookingSchema.index({ user: 1 }); // Instant access to user's booking history
bookingSchema.index({ event: 1 }); // Quick analytics (e.g., "How many booked for Event X?")
bookingSchema.index({ createdAt: -1 }); // Optimized sorting for recent bookings

module.exports = mongoose.model('Booking', bookingSchema);