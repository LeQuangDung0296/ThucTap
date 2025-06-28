const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    children: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: 500
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });

// Middleware để kiểm tra ngày check-in và check-out
bookingSchema.pre('save', function(next) {
  if (this.checkIn >= this.checkOut) {
    return next(new Error('Ngày check-out phải sau ngày check-in'));
  }
  next();
});

// Method để tính tổng tiền
bookingSchema.methods.calculateTotalPrice = function(roomPrice) {
  const days = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
  this.totalPrice = roomPrice * days;
  return this.totalPrice;
};

// Method để kiểm tra booking có thể hủy không
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const checkInDate = new Date(this.checkIn);
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
  
  return this.status === 'pending' || this.status === 'confirmed' && hoursUntilCheckIn > 24;
};

// Method để hủy booking
bookingSchema.methods.cancelBooking = function(userId, reason) {
  if (!this.canBeCancelled()) {
    throw new Error('Không thể hủy booking này');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  
  return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);
