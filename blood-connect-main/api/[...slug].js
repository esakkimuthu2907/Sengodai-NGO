// Vercel catch‑all serverless function
// Handles any request under /api/* by delegating to the Express app defined in backend/api/index.js

const app = require('../backend/api/index');

module.exports = app;
