const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const {
  createNews,
  getAllNews,
  getNewsByCategory,
  getNewsByArtist,
  getNewsForUser,
  incrementShareCount
} = require('../controllers/newsController');

// Public routes
router.get('/', getAllNews);
router.get('/category/:category', getNewsByCategory);
router.get('/artist/:artistId', getNewsByArtist);
router.get('/user/:userId', getNewsForUser); // Personalized feed
 
// Protected admin routes
router.post('/', authenticate, authorize(['admin']), createNews);
router.patch('/share/:id', incrementShareCount); // Track social shares

module.exports = router;