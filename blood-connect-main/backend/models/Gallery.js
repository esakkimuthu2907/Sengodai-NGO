const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['photo', 'video'],
    required: true
  },
  url: {
    type: String,
    required: [true, 'Please add a URL']
  },
  youtubeId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);
