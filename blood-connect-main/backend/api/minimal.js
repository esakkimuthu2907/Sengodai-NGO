// Minimal test handler for Vercel
const express = require('express');

const app = express();

app.all('*', (req, res) => {
  res.json({
    ok: true,
    message: 'Minimal serverless handler working',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
