const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working', timestamp: new Date() });
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Blood Connect API health check' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Blood Connect API is running');
});

// All other routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/users', require('../routes/users'));
app.use('/api/requests', require('../routes/requests'));
app.use('/api/camps', require('../routes/camps'));
app.use('/api/donations', require('../routes/donations'));
app.use('/api/contact', require('../routes/contact'));
app.use('/api/messages', require('../routes/messages'));
app.use('/api/gallery', require('../routes/gallery'));
app.use('/api/announcements', require('../routes/announcements'));
app.use('/api/admin/db', require('../routes/admin'));
app.use('/api', require('../routes/stats'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

module.exports = app;
