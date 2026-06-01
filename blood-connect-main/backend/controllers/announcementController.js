const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    const items = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    }
    const item = await Announcement.create({
      title,
      content,
      type: type || 'info'
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const item = await Announcement.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
