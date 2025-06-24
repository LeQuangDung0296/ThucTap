const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@cluster0.mongodb.net/hotel_management?retryWrites=true&w=majority';

async function createAdminUser() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Tạo user admin mới
    const adminUser = new User({
      username: 'admin',
      email: 'admin@hotel.com',
      password: 'admin123', // Sẽ được hash tự động
      fullName: 'Administrator',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@hotel.com');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdminUser(); 