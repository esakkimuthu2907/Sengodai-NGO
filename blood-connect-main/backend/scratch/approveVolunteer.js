const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const connectDB = require('../config/db');
const User = require('../models/User');

async function run() {
  try {
    await connectDB();
    const user = await User.findOne({ email: 'ramesh@gmail.com' });
    if (!user) {
      console.error('Volunteer not found');
      process.exit(1);
    }
    user.status = 'Approved';
    await user.save();
    console.log('Volunteer user approved');
    process.exit();
  } catch (err) {
    console.error('Error approving volunteer:', err);
    process.exit(1);
  }
}

run();
