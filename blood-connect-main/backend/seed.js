const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');
const Camp = require('./models/Camp');

dotenv.config();

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    // Attempt to connect using standard method with fallback to local persistent DB
    await connectDB();
    // Wait for connection to be fully established by mongoose
    while (mongoose.connection.readyState !== 1) {
      await new Promise(res => setTimeout(res, 100));
    }

    console.log('Clearing old data...');
    await User.deleteMany();
    await BloodRequest.deleteMany();
    await Camp.deleteMany();

    console.log('Seeding users...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sengodai.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    const adminPhone = process.env.ADMIN_PHONE || '9876543210';
    const adminLocation = process.env.ADMIN_LOCATION || 'Tirunelveli';
    const adminBloodGroup = process.env.ADMIN_BLOODGROUP || 'O+';

    const users = await User.create([
      {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: adminPhone,
        location: adminLocation,
        bloodGroup: adminBloodGroup
      },
      {
        name: 'Ramesh Kumar',
        email: 'ramesh@gmail.com',
        password: 'password123',
        role: 'user',
        phone: '9876500001',
        location: 'Tirunelveli',
        bloodGroup: 'B+'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@gmail.com',
        password: 'password123',
        role: 'user',
        phone: '9876500002',
        location: 'Chennai',
        bloodGroup: 'A+'
      }
    ]);

    console.log('Seeding camps...');
    const camps = await Camp.create([
      {
        name: 'Sengodai Mega Blood Camp',
        organizer: users[0]._id,
        date: new Date('2026-05-18'),
        location: 'Sengodai College, Tirunelveli',
        description: 'Join us for the biggest blood donation drive of the year.',
        status: 'Upcoming'
      }
    ]);

    console.log('Seeding requests...');
    await BloodRequest.create([
      {
        requesterId: users[1]._id,
        patientName: 'Arunkumar',
        bloodGroup: 'A+',
        units: 2,
        urgency: 'High',
        hospitalName: 'Apollo Hospital, Chennai',
        location: 'Chennai',
        contactName: 'Ramesh',
        contactPhone: '9876500001',
        status: 'Approved'
      }
    ]);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
