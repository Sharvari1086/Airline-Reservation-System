const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FIXED_ADMIN = {
  name: 'Admin User',
  email: 'admin@aerolink.com',
  password: 'admin123',
  phone: '1234567890',
  role: 'admin'
};

const createFixedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: FIXED_ADMIN.email });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(FIXED_ADMIN.password, salt);

      await User.create({
        name: FIXED_ADMIN.name,
        email: FIXED_ADMIN.email,
        password: hashedPassword,
        phone: FIXED_ADMIN.phone,
        role: FIXED_ADMIN.role
      });

      console.log('Admin created');
      console.log('Email:', FIXED_ADMIN.email);
      console.log('Password:', FIXED_ADMIN.password);
    } else {
      console.log('Admin exists');
      console.log('Email:', FIXED_ADMIN.email);
      console.log('Password:', FIXED_ADMIN.password);
    }
  } catch (error) {
    console.error('Admin creation error:', error.message);
  }
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    await createFixedAdmin();
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
  });

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
  console.log('API URL: http://localhost:' + PORT + '/api');
  console.log('Admin: admin@aerolink.com / admin123');
});