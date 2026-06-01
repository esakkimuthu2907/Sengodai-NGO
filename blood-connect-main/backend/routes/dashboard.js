const express = require('express');
const router = express.Router();
const { getAdminStats, getVolunteerStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), getAdminStats);

// @route   GET /api/dashboard/volunteer
// @desc    Get volunteer dashboard statistics
// @access  Private
router.get('/volunteer', protect, getVolunteerStats);

module.exports = router;
