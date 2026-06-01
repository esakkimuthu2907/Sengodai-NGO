const Gallery = require('../models/Gallery');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Private
exports.getGallery = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, description, mediaType, url, youtubeId } = req.body;
    if (!title || !mediaType || !url) {
      return res.status(400).json({ success: false, message: 'Please provide title, mediaType, and url' });
    }
    const item = await Gallery.create({
      title,
      description,
      mediaType,
      url,
      youtubeId
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
exports.updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    const { title, description, mediaType, url, youtubeId } = req.body;
    item.title = title || item.title;
    item.description = description || item.description;
    item.mediaType = mediaType || item.mediaType;
    item.url = url || item.url;
    item.youtubeId = youtubeId || item.youtubeId;

    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
