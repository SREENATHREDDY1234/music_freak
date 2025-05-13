const Artist = require('../models/Artist');

// Create artist (admin-only)
exports.createArtist = async (req, res) => {
  try {
    const { name, genre } = req.body;

    if (!name || !genre) {
      return res.status(400).json({ error: 'Name and genre are required' });
    }

    const existingArtist = await Artist.findOne({ name });
    if (existingArtist) {
      return res.status(400).json({ error: 'Artist already exists' });
    }

    const artist = await Artist.create(req.body);
    res.status(201).json(artist);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 
// Get all artists
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single artist
exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate('upcomingEvents');

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update artist
exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.status(200).json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete artist
exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};