// index.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const { authenticate } = require('./middleware/auth');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const newsRoutes = require('./routes/newsRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
 
// Database Connection
mongoose.connect(config.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/news', newsRoutes);

app.use('/', (req, res) => {
  res.json({ message: 'Welcome to the Event Management API!' });
});

// Protected Test Route
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: `Hello ${req.user.role} ${req.user.name}!` });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal Server Error' 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});