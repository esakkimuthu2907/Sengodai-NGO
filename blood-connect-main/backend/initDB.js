#!/usr/bin/env node

/**
 * Database Initialization Script
 * Sets up indexes and performs initial configuration
 * Run: node initDB.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');
const Camp = require('./models/Camp');
const Donation = require('./models/Donation');
const Message = require('./models/Message');
const ContactMessage = require('./models/ContactMessage');
const Gallery = require('./models/Gallery');
const Announcement = require('./models/Announcement');
const Notification = require('./models/Notification');

// Import connection function
const connectDB = require('./config/db');

const log = (msg, type = 'info') => {
  const timestamps = new Date().toISOString();
  const prefix = {
    info: '📌',
    success: '✅',
    warn: '⚠️ ',
    error: '❌'
  }[type];

  console.log(`[${timestamps}] ${prefix} ${msg}`);
};

async function createIndexes() {
  try {
    log('Creating database indexes...', 'info');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    log('✓ User email index created', 'success');

    await User.collection.createIndex({ bloodGroup: 1 });
    log('✓ User bloodGroup index created', 'success');

    await User.collection.createIndex({ isAvailableForDonation: 1 });
    log('✓ User availability index created', 'success');

    // BloodRequest indexes
    await BloodRequest.collection.createIndex({ bloodGroup: 1 });
    log('✓ BloodRequest bloodGroup index created', 'success');

    await BloodRequest.collection.createIndex({ status: 1 });
    log('✓ BloodRequest status index created', 'success');

    await BloodRequest.collection.createIndex({ urgency: 1 });
    log('✓ BloodRequest urgency index created', 'success');

    await BloodRequest.collection.createIndex({ location: 1 });
    log('✓ BloodRequest location index created', 'success');

    await BloodRequest.collection.createIndex({ createdAt: -1 });
    log('✓ BloodRequest date index created', 'success');

    // Camp indexes
    await Camp.collection.createIndex({ date: -1 });
    log('✓ Camp date index created', 'success');

    await Camp.collection.createIndex({ location: 1 });
    log('✓ Camp location index created', 'success');

    await Camp.collection.createIndex({ status: 1 });
    log('✓ Camp status index created', 'success');

    // Donation indexes
    await Donation.collection.createIndex({ donorId: 1 });
    log('✓ Donation donor index created', 'success');

    await Donation.collection.createIndex({ status: 1 });
    log('✓ Donation status index created', 'success');

    await Donation.collection.createIndex({ date: -1 });
    log('✓ Donation date index created', 'success');

    // Message indexes
    await Message.collection.createIndex({ recipientId: 1 });
    log('✓ Message recipient index created', 'success');

    await Message.collection.createIndex({ senderId: 1 });
    log('✓ Message sender index created', 'success');

    await Message.collection.createIndex({ isRead: 1 });
    log('✓ Message read status index created', 'success');

    // ContactMessage indexes
    await ContactMessage.collection.createIndex({ email: 1 });
    log('✓ ContactMessage email index created', 'success');

    await ContactMessage.collection.createIndex({ status: 1 });
    log('✓ ContactMessage status index created', 'success');

    // Gallery indexes
    await Gallery.collection.createIndex({ campId: 1 });
    log('✓ Gallery camp index created', 'success');

    await Gallery.collection.createIndex({ featured: 1 });
    log('✓ Gallery featured index created', 'success');

    // Announcement indexes
    await Announcement.collection.createIndex({ isActive: 1 });
    log('✓ Announcement active index created', 'success');

    // Notification indexes
    await Notification.collection.createIndex({ userId: 1 });
    log('✓ Notification user index created', 'success');

    await Notification.collection.createIndex({ isRead: 1 });
    log('✓ Notification read status index created', 'success');

    log('All indexes created successfully!', 'success');
  } catch (error) {
    log(`Error creating indexes: ${error.message}`, 'error');
    throw error;
  }
}

async function createDefaultAdmin() {
  try {
    log('Checking for default admin...', 'info');

    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      log(`Admin already exists: ${adminExists.email}`, 'warn');
      return;
    }

    log('Creating default admin user...', 'info');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@sengodai.org',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      location: 'Tirunelveli',
      bloodGroup: 'O+'
    });

    log(`Default admin created: ${admin.email}`, 'success');
    log('⚠️  Change the default password in production!', 'warn');
  } catch (error) {
    log(`Error creating admin: ${error.message}`, 'error');
    // Don't throw, just warn
  }
}

async function createDefaultVolunteer() {
  try {
    log('Checking for default volunteer...', 'info');

    const volunteerExists = await User.findOne({ email: 'esakkimuthu2907@gmail.com' });

    if (volunteerExists) {
      log(`Volunteer already exists: ${volunteerExists.email}`, 'warn');
      return;
    }

    log('Creating default volunteer user...', 'info');

    const volunteer = await User.create({
      name: 'Esakki Muthu',
      email: 'esakkimuthu2907@gmail.com',
      password: 'Esakki123',
      role: 'volunteer',
      phone: '9876543211',
      location: 'Tirunelveli',
      bloodGroup: 'B+',
      status: 'Approved'
    });

    log(`Default volunteer created: ${volunteer.email}`, 'success');
  } catch (error) {
    log(`Error creating volunteer: ${error.message}`, 'error');
  }
}

async function getStats() {
  try {
    const stats = {
      users: await User.countDocuments(),
      bloodRequests: await BloodRequest.countDocuments(),
      camps: await Camp.countDocuments(),
      donations: await Donation.countDocuments(),
      messages: await Message.countDocuments(),
      contactMessages: await ContactMessage.countDocuments(),
      galleries: await Gallery.countDocuments(),
      announcements: await Announcement.countDocuments(),
      notifications: await Notification.countDocuments()
    };

    log('Database Statistics:', 'info');
    Object.entries(stats).forEach(([key, value]) => {
      log(`  ${key}: ${value}`, 'info');
    });

    return stats;
  } catch (error) {
    log(`Error getting stats: ${error.message}`, 'error');
    throw error;
  }
}

async function main() {
  try {
    log('Blood Connect - Database Initialization', 'info');
    log('=====================================', 'info');

    // Connect to database
    log('Connecting to database...', 'info');
    await connectDB();
    log('Connected to database', 'success');

    // Create indexes
    await createIndexes();

    // Create default admin
    await createDefaultAdmin();

    // Create default volunteer
    await createDefaultVolunteer();

    // Show statistics
    log('', 'info');
    await getStats();

    log('', 'info');
    log('Database initialization complete! 🎉', 'success');
    log('You can now start the server with: npm start', 'info');

  } catch (error) {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    log('Database connection closed', 'info');
  }
}

// Run the script
main();
