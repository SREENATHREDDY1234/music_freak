const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: '' },
  preferences: {
    genres: [String], // e.g., ["Rock", "Pop"]
    favoriteArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }]
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  role: { 
    type: String, 
    enum: ['user', 'artist', 'admin'], 
    default: 'user' 
  }
},{timestamps: true});

//Index for faster search
userSchema.index({ 'preferences.genres': 1 }); // Faster genre-based recommendations
userSchema.index({ 'preferences.favoriteArtists': 1 }); // Quick access to user's fav artists

module.exports = mongoose.model('User', userSchema);