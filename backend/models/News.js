const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['New Release', 'Tour', 'Collaboration', 'Exclusive', 'Award'] 
  },
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Artist', 
    required: true 
  },
  publishDate: { 
    type: Date, 
    default: Date.now 
  },
  featuredImage: { 
    type: String  // URL to image
  },
  socialShares: {
    twitter: { type: Number, default: 0 },
    facebook: { type: Number, default: 0 },
    instagram: { type: Number, default: 0 }
  },
  tags: [String]  // e.g., ["Pop", "Grammy 2024"]
}); 

// Index for faster search
// Add to bottom of News.js
newsSchema.index({ artist: 1 }); // Faster news feeds for followed artists
newsSchema.index({ category: 1 }); // Quick filtering by news type (e.g., "New Releases")
newsSchema.index({ publishDate: -1 }); // Optimized sorting for recent news
newsSchema.index({ tags: 1 }); // Faster tag-based recommendations

module.exports = mongoose.model('News', newsSchema);