// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./Config/dbConfig');
const authRoutes = require('./Routes/authRoutes');
const studentRoutes = require('./Routes/studentRoutes');

const app = express();

// 1) DB
connectDB();

// 2) CORS
// Set CORS_ORIGIN in your backend env (e.g. https://your-site.netlify.app)
// For local dev, set CORS_ORIGIN=http://localhost:5173
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// 3) Body parsers
app.use(express.json());

// 4) Static: uploads (⚠️ ephemeral on Heroku/Render; prefer S3/Cloudinary for production)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5) Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// 6) Health check (handy for Render/Heroku)
app.get('/health', (_req, res) => res.send('OK'));

// 7) Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// 8) Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});