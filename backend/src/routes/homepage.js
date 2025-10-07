const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const authMiddleware = require('../middleware/auth');

const HOMEPAGE_FILE = path.join(__dirname, '../../../src/data/homepage.json');

// Get homepage data (public)
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(HOMEPAGE_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update homepage data (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { heroSection, statsSection, facilitiesSection, guidesSection } = req.body;
    
    if (!heroSection || !statsSection || !facilitiesSection || !guidesSection) {
      return res.status(400).json({ error: 'All sections are required' });
    }

    const data = { heroSection, statsSection, facilitiesSection, guidesSection };
    await fs.writeFile(HOMEPAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    
    res.json({ message: 'Homepage data updated successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;