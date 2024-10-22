const express = require('express');
const router = express.Router();
const db = require('../db');

// API endpoint to save countdown results
router.post('/save', (req, res) => {
  const { userName, roundName, success } = req.body;
  let { minutes, seconds } = req.body;

  // Convert minutes and seconds to integers, defaulting to 0 if empty
  minutes = parseInt(minutes) || 0;
  seconds = parseInt(seconds) || 0;

  console.log('Received save request:', { userName, roundName, success, minutes, seconds });

  // Insert the countdown result into the database
  const query = 'INSERT INTO records (userName, roundName, success, minutes, seconds, timestamp) VALUES (?, ?, ?, ?, ?, NOW())';
  db.query(query, [userName, roundName, success, minutes, seconds], (err, result) => {
    if (err) {
      console.error('Error saving record:', err);
      return res.status(500).json({ error: 'Failed to save record' });
    }
    console.log('Record saved successfully:', result);
    res.status(200).json({ message: 'Record saved successfully' });
  });
});

// API endpoint to retrieve today's records for the user
router.get('/today/:userName', (req, res) => {
  const userName = req.params.userName;
  console.log('Fetching today\'s records for user:', userName);

  // Query to get today's records for the user
  const query = `SELECT * FROM records WHERE userName = ? AND DATE(timestamp) = CURDATE() ORDER BY timestamp DESC`;
  db.query(query, [userName], (err, results) => {
    if (err) {
      console.error('Error fetching today\'s records:', err);
      return res.status(500).json({ error: 'Failed to fetch today\'s records' });
    }
    console.log('Today\'s records fetched successfully:', results);
    res.status(200).json(results);
  });
});

// API endpoint to delete a specific record
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  console.log('Deleting record with ID:', id);

  // Query to delete a specific record by ID
  const query = 'DELETE FROM records WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      return res.status(500).json({ error: 'Failed to delete record' });
    }
    console.log('Record deleted successfully:', result);
    res.status(200).json({ message: 'Record deleted successfully' });
  });
});

module.exports = router;