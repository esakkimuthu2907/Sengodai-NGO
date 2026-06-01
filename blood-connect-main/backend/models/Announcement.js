const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'urgent', 'success'],
    default: 'info'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
