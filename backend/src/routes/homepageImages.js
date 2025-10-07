const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');

// Define the homepage image folders
const HOMEPAGE_FOLDERS = ['hero', 'stats', 'facilities', 'guides'];
const PUBLIC_DIR = process.env.PUBLIC_DIR || path.join(__dirname, '../../../public');



// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const folder = req.params.folder;
    if (!HOMEPAGE_FOLDERS.includes(folder)) {
      return cb(new Error('Invalid folder'), null);
    }
    const uploadPath = path.join(PUBLIC_DIR, folder);
    
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Keep original filename or use custom name if provided
    const customName = req.body.customName;
    if (customName) {
      const ext = path.extname(file.originalname);
      cb(null, customName + ext);
    } else {
      cb(null, file.originalname);
    }
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all images in homepage folders
router.get('/', async (req, res) => {
  try {
    const result = {};
    
    for (const folder of HOMEPAGE_FOLDERS) {
      const folderPath = path.join(PUBLIC_DIR, folder);
      try {
        const files = await fs.readdir(folderPath);
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        });
        
        result[folder] = imageFiles.map(file => ({
          name: file,
          url: `/${folder}/${file}`,
          path: path.join(folderPath, file)
        }));
      } catch (err) {
        result[folder] = [];
      }
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get images from specific folder
router.get('/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    
    if (!HOMEPAGE_FOLDERS.includes(folder)) {
      return res.status(400).json({ error: 'Invalid folder' });
    }
    
    const folderPath = path.join(PUBLIC_DIR, folder);
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });
    
    const images = imageFiles.map(file => ({
      name: file,
      url: `/${folder}/${file}`,
      path: path.join(folderPath, file)
    }));
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image to specific folder
router.post('/:folder/upload', authMiddleware, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: err.message || 'Error uploading file' });
    }
    
    const { folder } = req.params;
    
    if (!HOMEPAGE_FOLDERS.includes(folder)) {
      return res.status(400).json({ error: 'Invalid folder' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      message: 'Image uploaded successfully',
      image: {
        name: req.file.filename,
        url: `/${folder}/${req.file.filename}`,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  });
});

// Delete image from specific folder
router.delete('/:folder/:filename', authMiddleware, async (req, res) => {
  try {
    const { folder, filename } = req.params;
    
    if (!HOMEPAGE_FOLDERS.includes(folder)) {
      return res.status(400).json({ error: 'Invalid folder' });
    }
    
    const filePath = path.join(PUBLIC_DIR, folder, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete the file
    await fs.unlink(filePath);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename image in specific folder
router.put('/:folder/:filename/rename', authMiddleware, async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const { newName } = req.body;
    
    if (!HOMEPAGE_FOLDERS.includes(folder)) {
      return res.status(400).json({ error: 'Invalid folder' });
    }
    
    if (!newName) {
      return res.status(400).json({ error: 'New name is required' });
    }
    
    const oldPath = path.join(PUBLIC_DIR, folder, filename);
    const ext = path.extname(filename);
    const newFilename = newName.endsWith(ext) ? newName : newName + ext;
    const newPath = path.join(PUBLIC_DIR, folder, newFilename);
    
    // Check if old file exists
    try {
      await fs.access(oldPath);
    } catch (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if new name already exists
    try {
      await fs.access(newPath);
      return res.status(400).json({ error: 'File with new name already exists' });
    } catch (err) {
      // Good, new name doesn't exist
    }
    
    // Rename the file
    await fs.rename(oldPath, newPath);
    
    res.json({
      message: 'Image renamed successfully',
      oldName: filename,
      newName: newFilename,
      url: `/${folder}/${newFilename}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;