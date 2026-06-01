const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary if keys exist
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Set up storage
let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  // Use Cloudinary
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blood-connect',
      allowedFormats: ['jpeg', 'png', 'jpg'],
    },
  });
} else {
  // Fallback to local storage if no Cloudinary config
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
  }
  
  storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
}

// Initialize multer
const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

module.exports = upload;
