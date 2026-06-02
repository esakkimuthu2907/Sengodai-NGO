const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Database connection options for better performance
const mongooseOptions = {
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
};

let mongoServer = null; // Store reference to in-memory server

const connectDB = async (retries = 5) => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URI)?.trim();

  // Try to connect to the provided MongoDB URI first (Atlas or local)
  if (mongoUri) {
    try {
      const safeMongoUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
      console.log(`🔗 Attempting to connect to MongoDB URI: ${safeMongoUri}`);
      const conn = await mongoose.connect(mongoUri, mongooseOptions);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      console.log(`🔐 Connection State: Connected`);
      return conn;
    } catch (connectionError) {
      console.error(`❌ MongoDB Connection Failed: ${connectionError.message}`);
      if (retries > 1) {
        console.log(`🔄 Retrying connection... (${retries - 1} attempts remaining)`);
        await new Promise(res => setTimeout(res, 2000)); // Wait 2 seconds before retry
        return connectDB(retries - 1);
      }
      console.error('➡️  Please ensure MongoDB is running at the configured MONGO_URI and that the URI is correct.');
      throw connectionError;
    }
  }

  // Fallback to local MongoDB when no explicit URI is configured
  console.log('📍 Attempting to connect to local MongoDB...');
  try {
    const localUri = 'mongodb://localhost:27017/blood-connect';
    const conn = await mongoose.connect(localUri, mongooseOptions);
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (localError) {
    console.error(`❌ Local MongoDB Connection Failed: ${localError.message}`);
    // Only allow in-memory fallback when explicitly enabled (for tests/local dev)
    const allowInMemory = process.env.ALLOW_IN_MEMORY === 'true' || process.env.NODE_ENV === 'test';
    if (!allowInMemory) {
      console.error('❌ No MongoDB available and in-memory fallback is disabled.');
      console.error('➡️  Start a local MongoDB, set MONGO_URI in your environment, or set ALLOW_IN_MEMORY=true for testing.');
      throw localError;
    }

    console.log('🔄 Falling back to In-Memory MongoDB (ALLOW_IN_MEMORY=true)...');

    // Last resort: Use in-memory MongoDB
    try {
      const dbPath = path.join(__dirname, '../data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri, mongooseOptions);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log(`⚠️  WARNING: Using in-memory database. Data will be lost on restart!`);
      console.log(`📊 Database: ${conn.connection.name}`);
      return conn;
    } catch (fallbackError) {
      console.error(`❌ All connection attempts failed: ${fallbackError.message}`);
      console.error(`Please ensure MongoDB is running or configure MONGO_URI in .env`);
      throw fallbackError;
    }
  }
};

// Handle connection events
const setupConnectionHandlers = () => {
  mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to database');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  Mongoose disconnected from database');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ Mongoose reconnected to database');
  });
};

// Graceful shutdown
const gracefulShutdown = async () => {
  if (mongoServer) {
    console.log('Stopping in-memory MongoDB server...');
    await mongoServer.stop();
  }
  await mongoose.connection.close();
  console.log('Database connection closed');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Setup connection event handlers
setupConnectionHandlers();

module.exports = connectDB;
