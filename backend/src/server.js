require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./utils/database');

const authRoutes = require('./routes/auth');
const mdxRoutes = require('./routes/mdx');
const imagesRoutes = require('./routes/images');
const peopleRoutes = require('./routes/people');
const peopleImagesRoutes = require('./routes/peopleImages');
const homepageRoutes = require('./routes/homepage');
const homepageImagesRoutes = require('./routes/homepageImages');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mdx', mdxRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/people-images', peopleImagesRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/homepage-images', homepageImagesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
