const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // null = broadcast to all
  },
  recipientRole: {
    type: String,
    enum: ['admin', 'volunteer', 'all']
  },
  type: {
    type: String,
    enum: ['urgent_request', 'request_approved', 'camp_reminder', 'admin_alert', 'general'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  relatedCamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
