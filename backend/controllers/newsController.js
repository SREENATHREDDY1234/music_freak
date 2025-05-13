const News = require('../models/News');
const Artist = require('../models/Artist');
const User = require('../models/User');
 
// {
//     "title": "New Album: Moonlight Sonata",
//     "content": "Artist XYZ drops surprise album...",
//     "category": "New Release",
//     "artist": "663b1c5e9a7d4f001f8e1d2a",
//     "tags": ["Classical", "Piano"]
//   }

// Create news (admin-only)
exports.createNews = async (req, res) => {
  try {
    const { artist, title, category } = req.body;

    // Validate artist exists
    const artistExists = await Artist.findById(artist);
    if (!artistExists) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const news = await News.create(req.body);
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all news (sorted by publish date)
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find()
      .populate('artist')
      .sort({ publishDate: -1 });
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get news by category (e.g., "New Release")
exports.getNewsByCategory = async (req, res) => {
  try {
    const news = await News.find({ category: req.params.category })
      .populate('artist');
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get news for a specific artist
exports.getNewsByArtist = async (req, res) => {
  try {
    const news = await News.find({ artist: req.params.artistId })
      .populate('artist');
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get personalized news for a user (based on followed artists)
exports.getNewsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const favoriteArtists = user.preferences.favoriteArtists;
    const news = await News.find({ artist: { $in: favoriteArtists } })
      .populate('artist')
      .sort({ publishDate: -1 });

    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Increment social share count (e.g., when user shares to Twitter)
exports.incrementShareCount = async (req, res) => {
  try {
    const { platform } = req.body; // "twitter", "facebook", or "instagram"
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`socialShares.${platform}`]: 1 } },
      { new: true }
    );
    res.status(200).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};