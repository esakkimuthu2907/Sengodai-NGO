const mongoose = require('mongoose');

// Database connection options
const mongooseOptions = {
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 15000,
  family: 4 // Use IPv4, skip trying IPv6
};

const connectDB = async () => {
  // Already connected — reuse
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If currently connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
      mongoose.connection.once('error', reject);
    });
  }

  const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not set. Please configure it in Vercel Environment Variables.');
  }

  try {
    const isAtlas = mongoUri.includes('+srv');
    const options = { ...mongooseOptions };
    if (isAtlas) {
      options.tls = true;
    }
    const safeUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`🔗 Connecting to MongoDB: ${safeUri}`);
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Failed: ${err.message}`);
    console.error(`➡️  Ensure your MongoDB Atlas cluster has 0.0.0.0/0 whitelisted under Network Access.`);
    throw err;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose error:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose disconnected');
});

module.exports = connectDB;
