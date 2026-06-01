const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: [true, 'Please add the patient name']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Please add the blood group']
  },
  units: {
    type: Number,
    required: [true, 'Please add number of units needed'],
    min: 1
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  hospitalName: {
    type: String,
    required: [true, 'Please add hospital name']
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  contactName: {
    type: String,
    required: [true, 'Please add contact name']
  },
  contactPhone: {
    type: String,
    required: [true, 'Please add contact phone number']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'],
    default: 'Pending'
  },
  volunteersAccepted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Performance indexes
requestSchema.index({ status: 1, urgency: 1, createdAt: -1 });
requestSchema.index({ bloodGroup: 1, status: 1 });

module.exports = mongoose.model('BloodRequest', requestSchema);
