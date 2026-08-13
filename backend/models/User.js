const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// 🔑 FIXED ADMIN CREDENTIALS
const FIXED_ADMIN = {
  name: 'Admin User',
  email: 'admin@aerolink.com',
  password: 'admin123',
  phone: '1234567890',
  role: 'admin'
};

// 🔑 Function to ensure admin exists
userSchema.statics.ensureAdmin = async function() {
  try {
    const existingAdmin = await this.findOne({ email: FIXED_ADMIN.email });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(FIXED_ADMIN.password, salt);
      
      const admin = new this({
        name: FIXED_ADMIN.name,
        email: FIXED_ADMIN.email,
        password: hashedPassword,
        phone: FIXED_ADMIN.phone,
        role: FIXED_ADMIN.role
      });
      
      await admin.save();
      console.log('✅ Fixed Admin Created!');
      console.log(`📧 ${FIXED_ADMIN.email}`);
      console.log(`🔑 ${FIXED_ADMIN.password}`);
    } else {
      console.log('✅ Admin already exists');
    }
  } catch (error) {
    console.error('❌ Admin creation error:', error.message);
  }
};

// 🔑 Function to get admin credentials
userSchema.statics.getAdminCredentials = function() {
  return {
    email: FIXED_ADMIN.email,
    password: FIXED_ADMIN.password
  };
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);