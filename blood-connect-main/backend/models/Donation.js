const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp'
  },
  bloodRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  units: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Completed'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for donor history queries
donationSchema.index({ donor: 1, donationDate: -1 });
donationSchema.index({ status: 1 });

module.exports = mongoose.model('Donation', donationSchema);
