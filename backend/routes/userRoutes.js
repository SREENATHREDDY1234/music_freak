const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', authenticate, (req, res) => {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    getUserProfile(req, res);
  });
  

module.exports = router;