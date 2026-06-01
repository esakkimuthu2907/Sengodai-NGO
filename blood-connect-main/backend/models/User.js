const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'volunteer', 'admin'],
    default: 'user'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function() { return this.role === 'user'; }
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  title: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true,
    default: 'India'
  },
  zipcode: {
    type: String,
    trim: true
  },
  dob: {
    type: Date
  },
  age: {
    type: Number,
    min: 0
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Others'],
    default: 'Male'
  },
  occupation: {
    type: String,
    trim: true
  },
  qualification: {
    type: String,
    trim: true
  },
  idDocument: {
    type: String,
    trim: true
  },
  workProfile: {
    type: String,
    trim: true
  },
  isAvailableForDonation: {
    type: Boolean,
    default: true
  },
  lastDonationDate: {
    type: Date
  },
  profileImage: {
    type: String,
    default: 'default.jpg'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Compound index for blood matching algorithm
userSchema.index({ bloodGroup: 1, isAvailableForDonation: 1 });
userSchema.index({ location: 1 });

// Encrypt password using bcrypt and compute age from date of birth
userSchema.pre('save', async function() {
  if (this.dob && this.isModified('dob')) {
    const birthDate = new Date(this.dob);
    if (!Number.isNaN(birthDate.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
      }
      this.age = Math.max(age, 0);
    }
  }

  if (this.role === 'admin') {
    this.status = 'Approved';
  }

  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
