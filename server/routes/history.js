const express = require('express');
const router = express.Router();
const db = require('../db');

// API endpoint to fetch user's history of countdown rounds
router.get('/history/:userName', (req, res) => {
  const userName = req.params.userName;
  console.log('Fetching history for user:', userName);

  // Query to get a summary of records grouped by date
  const query = `
    SELECT 
      DATE(timestamp) AS date,
      SUM(success) AS successfulRounds,
      SUM(NOT success) AS failedRounds,
      SUM(minutes * 60 + seconds) AS totalSpentTime
    FROM records
    WHERE userName = ?
    GROUP BY DATE(timestamp)
    ORDER BY DATE(timestamp) DESC`;
  db.query(query, [userName], (err, results) => {
    if (err) {
      console.error('Error fetching history:', err);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
    console.log('History fetched successfully:', results);
    res.status(200).json(results);
  });
});

// API endpoint to fetch detailed records for a specific day
router.get('/history/:userName/:date', (req, res) => {
  const { userName, date } = req.params;
  console.log(`Fetching detailed records for user: ${userName} on date: ${date}`);

  // Query to get detailed records for the specified date
  const query = `
    SELECT 
      roundName,
      success,
      minutes,
      seconds
    FROM records
    WHERE userName = ? AND DATE(timestamp) = ?
    ORDER BY timestamp DESC`;
  db.query(query, [userName, date], (err, results) => {
    if (err) {
      console.error('Error fetching detailed records:', err);
      return res.status(500).json({ error: 'Failed to fetch detailed records' });
    }
    console.log('Detailed records fetched successfully:', results);
    res.status(200).json(results);
  });
});

module.exports = router;