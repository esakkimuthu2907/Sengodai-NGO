const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');

// Load env vars
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const app = express();
app.set('trust proxy', 1);

// Security Middleware
const helmet = require('helmet');
app.use(helmet());

// Determine environment mode early
const rateLimit = require('express-rate-limit');
const isDevOrTest = process.env.NODE_ENV !== 'production';

// Enable CORS — allow any vercel.app origin and configured FRONTEND_URL
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any vercel.app preview/production URL
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    // Allow in development
    if (isDevOrTest) return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || isDevOrTest,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 1000 : 20,
  message: { success: false, message: 'Too many failed login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: () => isDevOrTest,
});
app.use(limiter);

// Body parser
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Blood Connect API is running...' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blood Connect API is healthy' });
});

// Seed default admin + volunteer on first DB connection
let seeded = false;
const seedDatabase = async () => {
  if (seeded) return;
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return;

    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    // Upsert admin — ensure it always exists with correct password
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sengodai.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUser = await User.findOne({ email: adminEmail }).select('+password');
    if (!adminUser) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin User',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: process.env.ADMIN_PHONE || '9876543210',
        location: process.env.ADMIN_LOCATION || 'Tirunelveli',
        bloodGroup: process.env.ADMIN_BLOODGROUP || 'O+',
        status: 'Approved'
      });
      console.log('Created default admin:', adminEmail);
    } else {
      // Always ensure password is correct (fix stale hashes)
      const pwMatch = await bcrypt.compare(adminPassword, adminUser.password);
      if (!pwMatch) {
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(adminPassword, salt);
        await adminUser.save({ validateModifiedOnly: true });
        console.log('Reset admin password:', adminEmail);
      }
    }

    // Upsert volunteer — ensure it always exists with correct password
    const volunteerEmail = process.env.DEFAULT_VOLUNTEER_EMAIL || 'esakkimuthu2907@gmail.com';
    const volunteerPassword = process.env.DEFAULT_VOLUNTEER_PASSWORD || 'Esakki123';
    const volunteerUser = await User.findOne({ email: volunteerEmail }).select('+password');
    if (!volunteerUser) {
      await User.create({
        name: 'Esakkimuthu Sengodai',
        email: volunteerEmail,
        password: volunteerPassword,
        role: 'volunteer',
        phone: '7904577032',
        location: 'Tamil Nadu',
        bloodGroup: 'B+',
        status: 'Approved'
      });
      console.log('Created default volunteer:', volunteerEmail);
    } else {
      // Always ensure password is correct (fix stale hashes)
      const pwMatch = await bcrypt.compare(volunteerPassword, volunteerUser.password);
      if (!pwMatch) {
        const salt = await bcrypt.genSalt(10);
        volunteerUser.password = await bcrypt.hash(volunteerPassword, salt);
        await volunteerUser.save({ validateModifiedOnly: true });
        console.log('Reset volunteer password:', volunteerEmail);
      }
    }

    seeded = true;
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

// Ensure DB is connected before handling any request (serverless-friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB(1);
    await seedDatabase();
  } catch (err) {
    console.error('DB connection error:', err.message);
  }
  next();
});

// Mount routers
app.use('/api/auth', authLimiter, require('../routes/auth'));
app.use('/api/users', require('../routes/users'));
app.use('/api/requests', require('../routes/requests'));
app.use('/api/camps', require('../routes/camps'));
app.use('/api/upload', require('../routes/upload'));
app.use('/api/dashboard', require('../routes/dashboard'));
app.use('/api/donations', require('../routes/donations'));
app.use('/api/contact', require('../routes/contact'));
app.use('/api/messages', require('../routes/messages'));
app.use('/api/gallery', require('../routes/gallery'));
app.use('/api/announcements', require('../routes/announcements'));
app.use('/api/admin/db', require('../routes/admin'));
app.use('/api', require('../routes/stats'));

module.exports = app;
