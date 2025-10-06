const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const authMiddleware = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../public/images_mdx');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Sanitize filename
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '-' + sanitized);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Get all images
router.get('/', authMiddleware, async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, '../../../public/images_mdx');
    await fs.mkdir(imagesDir, { recursive: true });
    const files = await fs.readdir(imagesDir);
    
    const images = await Promise.all(
      files
        .filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file))
        .map(async (file) => {
          const filePath = path.join(imagesDir, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            url: `/images_mdx/${file}`,
            size: stats.size,
            modified: stats.mtime
          };
        })
    );
    
    res.json(images.sort((a, b) => b.modified - a.modified));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image
router.post('/upload', authMiddleware, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.message || 'Error uploading file' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      name: req.file.filename,
      url: `/images_mdx/${req.file.filename}`,
      size: req.file.size
    });
  });
});

// Delete image
router.delete('/:filename', authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../../public/images_mdx', filename);
    await fs.unlink(filePath);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
