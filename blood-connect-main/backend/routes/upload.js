const express = require('express');
const router = express.Router();
const upload = require('../config/upload');

// @route   POST /api/upload
// @desc    Upload an image/video and return Base64 data URI
// @access  Public
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  try {
    // Convert buffer to Base64 data URI
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    res.status(200).json({
      success: true,
      data: dataUri
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload processing failed' });
  }
});

module.exports = router;
