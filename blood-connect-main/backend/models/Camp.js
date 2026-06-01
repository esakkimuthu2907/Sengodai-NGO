const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a camp name']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add the camp date']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    default: 'default-camp.jpg'
  },
  expectedDonors: {
    type: Number,
    default: 0
  },
  registeredDonors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
}, {
  timestamps: true
});

// Performance indexes
campSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Camp', campSchema);
