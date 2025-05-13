const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artist', 
    required: true 
  },
  venue: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    location: {  // GeoJSON for geospatial queries
      type: { 
        type: String, 
        default: 'Point' 
      },
      coordinates: { 
        type: [Number],  // [longitude, latitude]
        required: true 
      }
    }
  },
  ticketTypes: [{
    type: { 
      type: String, 
      required: true, 
      enum: ['VIP', 'General', 'Premium',"Gold","Silver","Platinum"] // Add more types as needed
    },
    price: { 
      type: Number, 
      required: true 
    },
    totalQuantity: { 
      type: Number, 
      required: true 
    },
    available: { 
      type: Number, 
      required: true 
    }
  }],
  
},{timestamps: true});

// Create geospatial index for location-based searches
eventSchema.index({ 'venue.location': '2dsphere' });
// const userCoordinates = [77.5946, 12.9716]; // [longitude, latitude]

// Example of a geospatial query to find events near a user's location
// This is just an example and should be placed in the appropriate controller or service
// const events = await Event.find({
//   'venue.location': {
//     $near: {
//       $geometry: {
//         type: "Point",
//         coordinates: userCoordinates
//       },
//       $maxDistance: 50000 // in meters (50 km)
//     }
//   }
// });

// Index for faster search
// Add to bottom of Event.js
eventSchema.index({ date: 1 }); // Faster sorting/pagination by date
eventSchema.index({ artist: 1 }); // Speeds up "Events by Artist" queries


module.exports = mongoose.model('Event', eventSchema);