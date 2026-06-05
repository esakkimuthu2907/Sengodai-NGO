require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  // Approve all volunteers and users with Pending status
  const result = await User.updateMany(
    { role: { $in: ['volunteer', 'user'] }, status: 'Pending' },
    { $set: { status: 'Approved' } }
  );
  console.log('Updated', result.modifiedCount, 'user(s) to Approved status');
  
  // List all volunteers
  const vols = await User.find({ role: 'volunteer' }, 'name email status role');
  console.log('All volunteers:', JSON.stringify(vols, null, 2));
  mongoose.disconnect();
}).catch(e => console.error('Error:', e.message));
