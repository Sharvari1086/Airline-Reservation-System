const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

// Import models
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔑 FIXED ADMIN CREDENTIALS - Hardcoded in code
const FIXED_ADMIN = {
  name: 'Admin User',
  email: 'admin@aerolink.com',
  password: 'admin123',
  phone: '1234567890',
  role: 'admin'
};

// Function to create fixed admin user on server start
const createFixedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: FIXED_ADMIN.email });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(FIXED_ADMIN.password, salt);
      
      const admin = new User({
        name: FIXED_ADMIN.name,
        email: FIXED_ADMIN.email,
        password: hashedPassword,
        phone: FIXED_ADMIN.phone,
        role: FIXED_ADMIN.role
      });
      
      await admin.save();
      console.log('✅ Fixed Admin User Created Successfully!');
      console.log(`📧 Email: ${FIXED_ADMIN.email}`);
      console.log(`🔑 Password: ${FIXED_ADMIN.password}`);
    } else {
      console.log('✅ Fixed Admin User Already Exists');
      console.log(`📧 Email: ${FIXED_ADMIN.email}`);
      console.log(`🔑 Password: ${FIXED_ADMIN.password}`);
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    // Create fixed admin on server start
    await createFixedAdmin();
  })
  .catch((err) => {
    console.error('❌ MongoDB Atlas Connection Error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working! 🚀',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Get admin credentials endpoint
app.get('/api/admin/credentials', (req, res) => {
  res.json({
    success: true,
    admin: {
      email: FIXED_ADMIN.email,
      password: FIXED_ADMIN.password
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`👤 Admin: admin@aerolink.com / admin123`);
});