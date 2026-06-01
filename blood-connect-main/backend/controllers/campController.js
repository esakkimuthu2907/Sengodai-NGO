const Camp = require('../models/Camp');

// @desc    Get all camps
// @route   GET /api/camps
// @access  Public
exports.getCamps = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
       return res.status(200).json({ success: true, data: [] });
    }
    const camps = await Camp.find().populate('organizer', 'name email');
    res.status(200).json({ success: true, data: camps });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single camp
// @route   GET /api/camps/:id
// @access  Public
exports.getCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id).populate('organizer', 'name email');
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }
    res.status(200).json({
      success: true,
      data: camp
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new camp
// @route   POST /api/camps
// @access  Private/Admin
exports.createCamp = async (req, res) => {
  try {
    req.body.organizer = req.user.id;
    const camp = await Camp.create(req.body);
    res.status(201).json({
      success: true,
      data: camp
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update camp
// @route   PUT /api/camps/:id
// @access  Private/Admin
exports.updateCamp = async (req, res) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }
    res.status(200).json({
      success: true,
      data: camp
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete camp
// @route   DELETE /api/camps/:id
// @access  Private/Admin
exports.deleteCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ success: false, message: 'Camp not found' });
    }
    await Camp.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
