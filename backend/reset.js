const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all old admins
    const deleted = await User.deleteMany({ email: 'admin@aerolink.com' });
    console.log('Deleted old admin(s):', deleted.deletedCount);

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    console.log('New hash:', hash);

    // Create admin directly with hashed password (bypass pre-save hook)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@aerolink.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin'
    });

    console.log('Admin created');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Stored hash:', admin.password);

    // Test the password
    const testResult = await bcrypt.compare('admin123', admin.password);
    console.log('Password test result:', testResult);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

reset();