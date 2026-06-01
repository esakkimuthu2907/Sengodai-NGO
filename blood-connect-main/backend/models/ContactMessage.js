const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    minlength: [10, 'Message must be at least 10 characters']
  },
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Replied'],
    default: 'Unread'
  },
  reply: {
    type: String
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
});

contactMessageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
