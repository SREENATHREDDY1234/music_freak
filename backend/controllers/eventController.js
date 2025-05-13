const Event = require('../models/Event');
const Artist = require('../models/Artist');

//example for event data
// {
//     "name": "Arijit Singh Live in Hyderabad",
//     "date": "2025-06-01T19:00:00Z",
//     "artist": "663d1f2e9b1ad303bf3fdf91",
//     "venue": {
//       "name": "Gachibowli Stadium",
//       "address": "Gachibowli, Hyderabad, Telangana",
//       "city": "Hyderabad",
//       "location": {
//         "type": "Point",
//         "coordinates": [78.3489, 17.4449]
//       }
//     },
//     "ticketTypes": [
//       { "type": "VIP", "price": 3000, "quantity": 100, "available": 80 },
//       { "type": "General", "price": 1000, "quantity": 500, "available": 460 }
//     ]
//   }
  

// Create event (admin-only)
exports.createEvent = async (req, res) => {
  try {
    const { artist, ticketTypes, ...eventData } = req.body;
    
    // Initialize available = totalQuantity for each ticket type
    const processedTickets = ticketTypes.map(t => ({
      ...t,
      available: t.totalQuantity
    }));

    const event = await Event.create({
      ...eventData,
      artist,
      ticketTypes: processedTickets
    });

    // Link to artist
    await Artist.findByIdAndUpdate(artist, { 
      $push: { upcomingEvents: event._id } 
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('artist')
      .sort({ date: 1 }); // Sort by date
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('artist');

    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Remove event from artist's schedule
    await Artist.findByIdAndUpdate(
      event.artist,
      { $pull: { upcomingEvents: event._id } }
    );

    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Find events near a location
exports.getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, distance = 50 } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid coordinate format' });
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const events = await Event.find({
      'venue.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude] // Note: [lng, lat] order
          },
          $maxDistance: distance * 1000 // Convert km to meters
        }
      }
    }).populate('artist');

    res.status(200).json(events);
  } catch (err) {
    console.error('Geospatial query error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};