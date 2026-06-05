const BloodRequest = require('../models/BloodRequest');
const sendEmail = require('../utils/sendEmail');
const { getCompatibleDonors } = require('../utils/bloodMatching');

// @desc    Get all blood requests
// @route   GET /api/requests
// @access  Public
exports.getRequests = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
       return res.status(200).json({ success: true, data: [] });
    }
    const requests = await BloodRequest.find().populate('requesterId', 'name email phone role bloodGroup location');
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single blood request
// @route   GET /api/requests/:id
// @access  Public
exports.getRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate('requesterId', 'name email phone');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new blood request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
  try {
    req.body.requesterId = req.user.id;
    const request = await BloodRequest.create(req.body);

    // Trigger modern SMS, WhatsApp, socket, and DB notifications for all blood requests
    const { sendBloodRequestAlerts } = require('../utils/notificationService');
    await sendBloodRequestAlerts(request, req.app);

    // Socket.io: Notify admins if critical (backwards compatibility)
    if (request.urgency === 'Critical') {
      const io = req.app.get('io');
      if (io) {
        io.emit('admin_alert', { message: 'New CRITICAL blood request!', request });
      }

      // Email Admins (Simulated)
      try {
        await sendEmail({
          email: 'admin@sengodai.org',
          subject: 'CRITICAL: New Blood Request',
          message: `A new critical blood request for ${request.bloodGroup} has been placed at ${request.hospitalName}.`
        });
      } catch (err) {
        console.error('Email could not be sent', err);
      }
    }

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update blood request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res) => {
  try {
    let request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    // Make sure user is request owner or admin
    if (request.requesterId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this request' });
    }

    const previousStatus = request.status;
    request = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Real-time Event: Notify donors if status becomes Approved
    if (previousStatus !== 'Approved' && request.status === 'Approved') {
      const io = req.app.get('io');
      if (io) {
        // Find all compatible blood types for the requested blood group
        const compatibleGroups = getCompatibleDonors(request.bloodGroup);
        
        // Emit to a specific room for EACH compatible blood group
        compatibleGroups.forEach(group => {
          io.to(`bloodGroup:${group}`).emit('new_urgent_request', {
            message: `Urgent need for ${request.bloodGroup} blood at ${request.hospitalName}! Your blood type (${group}) is a match!`,
            request
          });
        });
      }
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete blood request
// @route   DELETE /api/requests/:id
// @access  Private
exports.deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Make sure user is request owner or admin
    if (request.requesterId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this request' });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
