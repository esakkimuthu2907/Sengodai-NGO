const express = require('express');
const { getStats, getUrgentRequests, getUpcomingCamps, getDonors } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/stats', getStats);
router.get('/urgent-requests', getUrgentRequests);
router.get('/upcoming-camps', getUpcomingCamps);

// Private (authenticated)
router.get('/donors', protect, getDonors);

module.exports = router;
