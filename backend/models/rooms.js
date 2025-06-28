const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  roomType: {
    type: String,
    required: true,
    enum: ['single', 'double', 'suite', 'deluxe'],
    default: 'single'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  amenities: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  floor: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ roomType: 1 });

// Method để kiểm tra phòng có sẵn không
roomSchema.methods.isAvailable = function() {
  return this.status === 'available' && this.isActive;
};

// Method để cập nhật trạng thái phòng
roomSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

module.exports = mongoose.model('Room', roomSchema);
