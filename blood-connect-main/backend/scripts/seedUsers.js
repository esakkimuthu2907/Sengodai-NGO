// backend/scripts/seedUsers.js
// Run this script to create the default admin and regular user accounts.
// Ensure the environment variable MONGO_URI points to your Atlas cluster.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  {
    name: 'Admin',
    email: 'admin@sengodai.org',
    password: 'admin123',
    role: 'admin',
    phone: '9999999999',
    location: 'Admin City',
    status: 'Approved'
  },
  {
    name: 'Esakki',
    email: 'esakkimuthu2907@gmail.com',
    password: 'Esakki123',
    role: 'user',
    phone: '8888888888',
    location: 'User City',
    status: 'Approved'
  }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`User ${u.email} already exists, skipping.`);
        continue;
      }
      const newUser = new User(u);
      await newUser.save();
      console.log(`Created user ${u.email}`);
    }
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
