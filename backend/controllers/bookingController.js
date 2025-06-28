const Booking = require('../models/Booking');
const Room = require('../models/rooms');
const User = require('../models/User');

// Tạo booking mới
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      contactInfo
    } = req.body;

    const userId = req.user.userId;

    // Kiểm tra dữ liệu đầu vào
    if (!roomId || !checkIn || !checkOut || !guests || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Kiểm tra phòng có tồn tại không
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    // Kiểm tra phòng có sẵn không
    if (!room.isAvailable()) {
      return res.status(400).json({
        success: false,
        message: 'Phòng không có sẵn'
      });
    }

    // Kiểm tra số khách có phù hợp với sức chứa phòng không
    if (guests.adults > room.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Số khách vượt quá sức chứa phòng'
      });
    }

    // Kiểm tra xem phòng có bị đặt trùng thời gian không
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ['pending', 'confirmed', 'checked-in'] },
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Phòng đã được đặt trong khoảng thời gian này'
      });
    }

    // Tạo booking mới
    const newBooking = new Booking({
      user: userId,
      room: roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      specialRequests,
      contactInfo
    });

    // Tính tổng tiền
    newBooking.calculateTotalPrice(room.price);

    await newBooking.save();

    // Cập nhật trạng thái phòng
    await room.updateStatus('reserved');

    // Populate thông tin phòng và user
    await newBooking.populate(['room', 'user', { path: 'user', select: '-password' }]);

    res.status(201).json({
      success: true,
      message: 'Đặt phòng thành công',
      data: newBooking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy danh sách booking của user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('room')
      .populate('user', '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy thông tin một booking
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', '-password')
      .populate('cancelledBy', '-password');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking'
      });
    }

    // Kiểm tra quyền truy cập (chỉ user tạo booking hoặc admin mới xem được)
    if (booking.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Cập nhật trạng thái booking (admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái là bắt buộc'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking'
      });
    }

    // Cập nhật trạng thái
    booking.status = status;
    if (notes) booking.notes = notes;

    // Cập nhật trạng thái phòng tương ứng
    const room = await Room.findById(booking.room);
    if (room) {
      switch (status) {
        case 'confirmed':
          await room.updateStatus('reserved');
          break;
        case 'checked-in':
          await room.updateStatus('occupied');
          break;
        case 'checked-out':
        case 'cancelled':
          await room.updateStatus('available');
          break;
      }
    }

    await booking.save();

    await booking.populate(['room', 'user', { path: 'user', select: '-password' }]);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái booking thành công',
      data: booking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Hủy booking
const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user.userId;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy booking'
      });
    }

    // Kiểm tra quyền hủy (chỉ user tạo booking hoặc admin mới hủy được)
    if (booking.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy booking này'
      });
    }

    // Kiểm tra có thể hủy không
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy booking này'
      });
    }

    // Hủy booking
    await booking.cancelBooking(userId, reason);

    // Cập nhật trạng thái phòng
    const room = await Room.findById(booking.room);
    if (room) {
      await room.updateStatus('available');
    }

    await booking.populate(['room', 'user', { path: 'user', select: '-password' }]);

    res.json({
      success: true,
      message: 'Hủy booking thành công',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy tất cả booking (admin only)
const getAllBookings = async (req, res) => {
  try {
    const { 
      status, 
      userId, 
      roomId, 
      startDate, 
      endDate,
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (roomId) filter.room = roomId;
    if (startDate || endDate) {
      filter.checkIn = {};
      if (startDate) filter.checkIn.$gte = new Date(startDate);
      if (endDate) filter.checkIn.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('room')
      .populate('user', '-password')
      .populate('cancelledBy', '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Thống kê booking
const getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const stats = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments(filter);
    const totalRevenue = await Booking.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
  getBookingStats
};
