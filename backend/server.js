const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.join(__dirname, '.env') });

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
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD,
  phone: process.env.ADMIN_PHONE,
  role: 'admin'
};

const createFixedAdmin = async () => {
  if (
    !FIXED_ADMIN.name ||
    !FIXED_ADMIN.email ||
    !FIXED_ADMIN.password ||
    !FIXED_ADMIN.phone
  ) {
    throw new Error(
      'ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PHONE must be set in backend/.env'
    );
  }

  let admin = await User.findOne({ email: FIXED_ADMIN.email }).select('+password');
  if (!admin) {
    admin = new User(FIXED_ADMIN);
  } else if (!(await admin.comparePassword(FIXED_ADMIN.password))) {
    admin.password = FIXED_ADMIN.password;
  }

  admin.name = FIXED_ADMIN.name;
  admin.phone = FIXED_ADMIN.phone;
  admin.role = FIXED_ADMIN.role;
  await admin.save();
  console.log('Admin account is ready:', FIXED_ADMIN.email);
};

mongoose
  .connect(process.env.MONGODB_URI, { dbName: 'aerolink' })
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    await createFixedAdmin();
  })
  .catch((err) => {
    console.error('Database startup error:', err.message);
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
});