// Load the environment variables from the .env file
require('dotenv').config();

// Import the required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import ALL routes
const authRoutes = require('./routes/authRoutes');
const donationItemRoutes = require('./routes/donationItemRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');

// Create the Express application
const app = express();

// Allow the frontend to communicate with the backend
app.use(cors());

// Allow the backend to receive JSON data
app.use(express.json());

// Mount API routes (These MUST come before any static serving or catch-all routes)
app.use('/api/auth', authRoutes);
app.use('/api/donation-items', donationItemRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

// Connect the backend to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) =>
    console.error('❌ MongoDB connection error:', err)
  );

// Use the port from .env or use 3010 by default
const PORT = process.env.PORT || 3010;

// Commented out for local Vite development to prevent ENOENT errors
/*
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
*/

// Start the backend server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});