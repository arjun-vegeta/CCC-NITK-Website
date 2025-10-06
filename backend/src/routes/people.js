const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const authMiddleware = require('../middleware/auth');

const PEOPLE_FILE = path.join(__dirname, '../../../src/data/people.json');

// Get people data (public)
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(PEOPLE_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update people data (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { staff, team } = req.body;
    
    if (!staff || !team) {
      return res.status(400).json({ error: 'Both staff and team data are required' });
    }

    const data = { staff, team };
    await fs.writeFile(PEOPLE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    
    res.json({ message: 'People data updated successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
