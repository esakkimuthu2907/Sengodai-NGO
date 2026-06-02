const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Start application after DB connection
const startApp = async () => {
  await connectDB();

  // Seed default admin if needed
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const User = require('./models/User');
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        console.log('No admin found, creating default admin...');
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@sengodai.org';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'Admin User';
        const adminPhone = process.env.ADMIN_PHONE || '9876543210';
        const adminLocation = process.env.ADMIN_LOCATION || 'Tirunelveli';
        const adminBloodGroup = process.env.ADMIN_BLOODGROUP || 'O+';

        await User.create({
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          phone: adminPhone,
          location: adminLocation,
          bloodGroup: adminBloodGroup
        });
        console.log(`Created admin: ${adminEmail}`);
      }

      // Create a default volunteer account for local development/demo
      const volunteerEmail = process.env.DEFAULT_VOLUNTEER_EMAIL || 'esakkimuthu2907@gmail.com';
      const volunteerPassword = process.env.DEFAULT_VOLUNTEER_PASSWORD || 'Esakki123';
      const volunteerExists = await User.findOne({ email: volunteerEmail });
      if (!volunteerExists) {
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
        console.log(`Created demo volunteer: ${volunteerEmail}`);
      }
    }
  } catch (seedErr) {
    console.error('Error during seeding:', seedErr.message);
  }
};

const app = express();
app.set('trust proxy', 1);

// Security Middleware
const helmet = require('helmet');
app.use(helmet());

// Determine environment mode early
const rateLimit = require('express-rate-limit');
const isDevOrTest = process.env.NODE_ENV !== 'production';

// Enable CORS — restrict to frontend URL in production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://blood-connect-frontend.vercel.app',
      'https://frontend-six-beta-otqlq2uoqr.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : [
      'http://localhost:8080',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (/^https:\/\/frontend-[a-z0-9-]+-esakkimuthu-s-s-projects\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      // In development, allow any origin
      callback(null, true);
    } else {
      // In production, reject disallowed origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate Limiting - strict for auth routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || isDevOrTest,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 1000 : 20, // allow more attempts in development/test
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

// Set static folder for local uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/admin/db', require('./routes/admin')); // Database management routes
app.use('/api', require('./routes/stats'));

app.get('/', (req, res) => {
  res.send('Blood Connect API is running...');
});

const PORT = process.env.PORT || 5000;

// Setup HTTP server for Socket.io
const http = require('http');
const server = http.createServer(app);

// Initialize Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

// Socket connection logic
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Clients can join rooms based on their roles or blood groups
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible in controllers
app.set('io', io);

// Start server after DB connection established
startApp().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to start application:', err.message);
  process.exit(1);
});
