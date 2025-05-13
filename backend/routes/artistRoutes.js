const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const { 
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist
} = require('../controllers/artistController');

// Public routes
router.get('/', getAllArtists);
router.get('/:id', getArtistById);

// Protected admin routes (add authentication middleware later)
router.post('/', authenticate, authorize(['admin']), createArtist);
router.put('/:id', authenticate, authorize(['admin','artist']), updateArtist);
router.delete('/:id',  authenticate, authorize(['admin']), deleteArtist);

module.exports = router;