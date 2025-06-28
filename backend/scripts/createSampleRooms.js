const mongoose = require('mongoose');
const Room = require('../models/rooms');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@cluster0.mongodb.net/hotel_management?retryWrites=true&w=majority';

const sampleRooms = [
  {
    roomNumber: '101',
    roomType: 'single',
    capacity: 1,
    price: 500000,
    description: 'Phòng đơn tiện nghi cơ bản',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh'],
    floor: 1,
    status: 'available'
  },
  {
    roomNumber: '102',
    roomType: 'single',
    capacity: 1,
    price: 500000,
    description: 'Phòng đơn tiện nghi cơ bản',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh'],
    floor: 1,
    status: 'available'
  },
  {
    roomNumber: '201',
    roomType: 'double',
    capacity: 2,
    price: 800000,
    description: 'Phòng đôi rộng rãi',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh', 'Mini bar'],
    floor: 2,
    status: 'available'
  },
  {
    roomNumber: '202',
    roomType: 'double',
    capacity: 2,
    price: 800000,
    description: 'Phòng đôi rộng rãi',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh', 'Mini bar'],
    floor: 2,
    status: 'available'
  },
  {
    roomNumber: '301',
    roomType: 'suite',
    capacity: 3,
    price: 1200000,
    description: 'Phòng suite cao cấp với view đẹp',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh', 'Mini bar', 'Bồn tắm', 'Ban công'],
    floor: 3,
    status: 'available'
  },
  {
    roomNumber: '302',
    roomType: 'suite',
    capacity: 3,
    price: 1200000,
    description: 'Phòng suite cao cấp với view đẹp',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh', 'Mini bar', 'Bồn tắm', 'Ban công'],
    floor: 3,
    status: 'available'
  },
  {
    roomNumber: '401',
    roomType: 'deluxe',
    capacity: 4,
    price: 1500000,
    description: 'Phòng deluxe sang trọng',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh', 'Mini bar', 'Bồn tắm', 'Ban công', 'Phòng khách'],
    floor: 4,
    status: 'available'
  },
  {
    roomNumber: '402',
    roomType: 'deluxe',
    capacity: 4,
    price: 1500000,
    description: 'Phòng deluxe sang trọng',
    amenities: ['WiFi', 'TV', 'Điều hòa', 'Tủ lạnh', 'Mini bar', 'Bồn tắm', 'Ban công', 'Phòng khách'],
    floor: 4,
    status: 'available'
  }
];

async function createSampleRooms() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    // Xóa tất cả phòng hiện có (optional)
    await Room.deleteMany({});
    console.log('Cleared existing rooms');

    // Tạo phòng mẫu
    const createdRooms = await Room.insertMany(sampleRooms);
    console.log(`Created ${createdRooms.length} sample rooms`);

    // Hiển thị danh sách phòng đã tạo
    console.log('\nSample rooms created:');
    createdRooms.forEach(room => {
      console.log(`- ${room.roomNumber}: ${room.roomType} (${room.price.toLocaleString()} VND)`);
    });

  } catch (error) {
    console.error('Error creating sample rooms:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createSampleRooms(); 