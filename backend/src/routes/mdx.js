const express = require('express');
const router = express.Router();
const {
    getFilesByCategory,
    getFile,
    updateFile,
    createFile,
    deleteFile,
    syncFiles
} = require('../controllers/mdxController');
const authMiddleware = require('../middleware/auth');

// Public routes (no auth required) - for frontend rendering
router.get('/public/:category', getFilesByCategory);
router.get('/public/:category/:filename', getFile);

// Protected routes (auth required) - for admin
router.use(authMiddleware);
router.post('/sync', syncFiles);
router.get('/:category', getFilesByCategory);
router.get('/:category/:filename', getFile);
router.put('/:category/:filename', updateFile);
router.post('/:category', createFile);
router.delete('/:category/:filename', deleteFile);

module.exports = router;
