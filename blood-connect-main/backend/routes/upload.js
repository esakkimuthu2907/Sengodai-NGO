const express = require('express');
const router = express.Router();
const upload = require('../config/upload');

// @route   POST /api/upload
// @desc    Upload an image
// @access  Public (or protected if you want)
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  // If using Cloudinary, path is in req.file.path. If local, it's also req.file.path but we return the relative path
  let imageUrl = req.file.path;
  
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // Local fallback formatting
    imageUrl = `/uploads/${req.file.filename}`;
  }

  res.status(200).json({
    success: true,
    data: imageUrl
  });
});

module.exports = router;
