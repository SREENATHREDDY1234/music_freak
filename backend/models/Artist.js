const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  bio: { 
    type: String, 
    default: '' 
  },
  genre: { 
    type: [String], 
    required: true 
  },
  discography: [{
    albumName: String,
    releaseDate: Date,
    tracks: [String]
  }],
  socialMedia: {
    website: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  upcomingEvents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }],
},{timestamps: true});

// Index for faster search
// Add to bottom of Artist.js
artistSchema.index({ genre: 1 }); // Faster genre filtering (e.g., "Show all Rock artists")
artistSchema.index({ upcomingEvents: 1 }); // Speeds up event population

module.exports = mongoose.model('Artist', artistSchema);