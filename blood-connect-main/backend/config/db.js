const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Database connection options for better performance
const mongooseOptions = {
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
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
      const isAtlas = mongoUri.includes('+srv');
      const options = { ...mongooseOptions, ...(isAtlas && { tls: true }) };
      const safeMongoUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
      console.log(`🔗 Attempting to connect to MongoDB URI: ${safeMongoUri}`);
      const conn = await mongoose.connect(mongoUri, options);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      console.log(`🔐 Connection State: Connected`);
      return conn;
    } catch (connectionError) {
      console.error(`❌ MongoDB Connection Failed: ${connectionError.message}`);
      console.error(`➡️  MongoDB Atlas connection failed. Please ensure your Vercel/Render server IP is whitelisted (add 0.0.0.0/0 on Atlas Network Access).`);
      console.log(`🔄 Attempting fallback to in-memory database...`);
    }
  }

  // Fallback to local MongoDB
  try {
    const localUri = 'mongodb://localhost:27017/blood-connect';
    const conn = await mongoose.connect(localUri, mongooseOptions);
    console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (localError) {
    console.log('🔄 Falling back to In-Memory MongoDB...');

    // Last resort: Use in-memory MongoDB
    try {
      const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA;
      const dbPath = isServerless ? '/tmp/data' : path.join(__dirname, '../data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      // Configure MongoMemoryServer download directory to writable /tmp on serverless environments
      process.env.MONGOMS_DOWNLOAD_DIR = '/tmp/mongodb-binaries';
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
