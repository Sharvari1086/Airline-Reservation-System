const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('node:path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'aerolink' });
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || !process.env.ADMIN_NAME || !process.env.ADMIN_PHONE) {
      throw new Error(
        'ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PHONE must be set in backend/.env'
      );
    }

    let admin = await User.findOne({ email }).select('+password');
    if (!admin) {
      admin = new User({ email });
    }
    admin.name = process.env.ADMIN_NAME;
    admin.password = password;
    admin.phone = process.env.ADMIN_PHONE;
    admin.role = 'admin';
    await admin.save();

    console.log('Admin account reset:', admin.email);
  } catch (err) {
    console.error('Error:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

reset();