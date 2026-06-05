const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  if (user.role === 'admin') {
    user.status = 'Approved';
  }

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup,
      location: user.location,
      phone: user.phone,
      status: user.status || 'Pending',
      title: user.title,
      address: user.address,
      area: user.area,
      country: user.country,
      zipcode: user.zipcode,
      dob: user.dob,
      age: user.age,
      gender: user.gender,
      occupation: user.occupation,
      qualification: user.qualification,
      idDocument: user.idDocument,
      workProfile: user.workProfile,
      createdAt: user.createdAt
    }
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      adminSecret,
      bloodGroup,
      phone,
      location,
      address,
      area,
      country,
      zipcode,
      dob,
      gender,
      occupation,
      qualification,
      idDocument,
      workProfile,
      title
    } = req.body;

    const userLocation = location || address || area || 'Unknown';
    const allowedRoles = ['user', 'volunteer', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'volunteer';

    if (userRole === 'admin') {
      if (!adminSecret || adminSecret !== process.env.ADMIN_SIGNUP_KEY) {
        return res.status(401).json({ success: false, message: 'Invalid admin signup secret' });
      }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      bloodGroup,
      phone,
      location: userLocation,
      address,
      area,
      country,
      zipcode,
      dob,
      gender,
      occupation,
      qualification,
      idDocument,
      workProfile,
      title,
      status: userRole === 'admin' ? 'Approved' : 'Pending'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const identifier = email || phone;
    console.log(`Login attempt for: ${identifier}`);

    // Validate identifier & password
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email or phone number and password' });
    }

    // Require MongoDB connection for login
    const query = email ? { email } : { phone };
    const user = await User.findOne(query).select('+password');

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }



    if (user.role === 'admin' && user.status !== 'Approved') {
      user.status = 'Approved';
      await user.save();
    }

    console.log('Login successful');
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === 'admin' && user.status !== 'Approved') {
      user.status = 'Approved';
      await user.save();
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // TODO: Send Email (Will be implemented in Phase 2)
    // For now, just return the token in development
    res.status(200).json({
      success: true,
      message: 'Email sent (simulated for Phase 1)',
      data: resetToken,
      resetUrl
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
