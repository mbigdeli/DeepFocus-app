const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory

// Import routes
const routes = require('./routes');
const historyRoutes = require('./routes/history'); // Import history routes
app.use('/', routes); // Use imported routes for handling requests
app.use('/', historyRoutes); // Use history routes for handling history-related requests

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // Log server start message
});