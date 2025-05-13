const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role:req.body.role || 'user',
            
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Email not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: 'bookings',
                populate: {
                    path: 'event',
                    populate: 'artist'
                }
            })
            .select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
    try {
        const { genres, favoriteArtists } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { 'preferences.genres': genres, 'preferences.favoriteArtists': favoriteArtists } },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};