const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Import routes
const uploadRouter = require('./routes/uploadRouter');
const downloadRouter = require('./routes/downloadRouter');

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
app.use('/', uploadRouter);
app.use('/', downloadRouter);

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Start server - Simplified for Render.com deployment
try {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Server startup error:', error);
  // Fallback if there's an error
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (fallback due to error)`);
  });
} 