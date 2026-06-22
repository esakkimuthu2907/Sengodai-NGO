const multer = require('multer');

// Use memory storage - files are kept in buffer, not written to disk
// This works perfectly on Vercel Serverless where disk is ephemeral
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|webp/i;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

module.exports = upload;
