// Load the environment variables from the .env file
require('dotenv').config();

// Import the required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import authentication routes
const authRoutes = require('./routes/authRoutes');

// Import donation item routes
const donationItemRoutes = require('./routes/donationItemRoutes');

// Import donation request routes
const donationRequestRoutes = require('./routes/donationRequestRoutes');

// Create the Express application
const app = express();

// Allow the frontend to communicate with the backend
app.use(cors());

// Allow the backend to receive JSON data
app.use(express.json());

// Use the authentication routes
// Example: /api/auth/login
app.use('/api/auth', authRoutes);

// Use the donation item routes
// Example: /api/donation-items
app.use('/api/donation-items', donationItemRoutes);

// Use the donation request routes
// Example: /api/donation-requests
app.use('/api/donation-requests', donationRequestRoutes);

// Connect the backend to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Use the port from .env or use 3010 by default
const PORT = process.env.PORT || 3010;

// Serve the compiled frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// Send the React application for frontend navigation
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the backend server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});