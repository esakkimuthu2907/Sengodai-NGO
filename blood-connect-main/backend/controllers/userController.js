const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
       return res.status(200).json({ success: true, data: [] });
    }
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create a new user or admin
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
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

    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, password, phone and location' });
    }

    const allowedRoles = ['user', 'volunteer', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'volunteer';

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
      title,
      status: userRole === 'admin' ? 'Approved' : 'Pending'
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    Object.keys(req.body).forEach(key => {
      if (key !== 'password') {
        user[key] = req.body[key];
      }
    });
    if (user.role === 'admin') {
      user.status = 'Approved';
    }
    await user.save();
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
