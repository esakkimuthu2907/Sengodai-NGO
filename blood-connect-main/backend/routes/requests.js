const express = require('express');
const { getRequests, getRequest, createRequest, updateRequest, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public emergency blood request (no login needed)
router.post('/emergency', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database connection failed.' });
    }
    const BloodRequest = require('../models/BloodRequest');
    const { sendBloodRequestAlerts } = require('../utils/notificationService');

    const { patientName, age, bloodGroup, units, hospitalName, location, contactPhone, urgency, notes } = req.body;
    if (!patientName || !bloodGroup || !units || !hospitalName || !location || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    // Use a dummy system requester ID or find the admin
    const User = require('../models/User');
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(500).json({ success: false, message: 'System not ready. Please try again.' });
    }

    const request = await BloodRequest.create({
      requesterId: admin._id,
      patientName,
      age: age ? Number(age) : undefined,
      bloodGroup,
      units: Number(units),
      hospitalName,
      location,
      contactPhone,
      contactName: patientName,
      urgency: urgency || 'High',
      notes: notes || 'Emergency request submitted from website homepage (no login)',
      status: 'Pending'
    });

    // Trigger WhatsApp + SMS alerts immediately
    await sendBloodRequestAlerts(request, req.app);

    res.status(201).json({
      success: true,
      message: 'Emergency request submitted! Admins have been notified via WhatsApp & SMS.',
      requestId: request._id.toString().slice(-6)
    });
  } catch (error) {
    console.error('Emergency request error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.route('/')
  .get(getRequests)
  .post(protect, createRequest);

router.route('/:id')
  .get(getRequest)
  .put(protect, updateRequest)
  .delete(protect, deleteRequest);

module.exports = router;

