const Room = require('../models/rooms');

// Lấy danh sách tất cả phòng
const getAllRooms = async (req, res) => {
  try {
    const { 
      status, 
      roomType, 
      minPrice, 
      maxPrice, 
      floor,
      page = 1, 
      limit = 10 
    } = req.query;

    // Xây dựng filter
    const filter = { isActive: true };
    
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;
    if (floor) filter.floor = floor;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Tính pagination
    const skip = (page - 1) * limit;
    
    const rooms = await Room.find(filter)
      .sort({ roomNumber: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Room.countDocuments(filter);

    res.json({
      success: true,
      data: rooms,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy thông tin một phòng
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      data: room
    });

  } catch (error) {
    console.error('Get room by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Tạo phòng mới
const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      roomType,
      capacity,
      price,
      description,
      amenities,
      floor
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!roomNumber || !roomType || !capacity || !price || !floor) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Kiểm tra roomNumber đã tồn tại
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Số phòng đã tồn tại'
      });
    }

    const newRoom = new Room({
      roomNumber,
      roomType,
      capacity,
      price,
      description,
      amenities: amenities || [],
      floor
    });

    await newRoom.save();

    res.status(201).json({
      success: true,
      message: 'Tạo phòng thành công',
      data: newRoom
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Cập nhật thông tin phòng
const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const updateData = req.body;

    // Không cho phép cập nhật roomNumber nếu đã có booking
    if (updateData.roomNumber) {
      const existingRoom = await Room.findOne({ 
        roomNumber: updateData.roomNumber,
        _id: { $ne: roomId }
      });
      
      if (existingRoom) {
        return res.status(400).json({
          success: false,
          message: 'Số phòng đã tồn tại'
        });
      }
    }

    const room = await Room.findByIdAndUpdate(
      roomId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật phòng thành công',
      data: room
    });

  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Xóa phòng (soft delete)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      message: 'Xóa phòng thành công'
    });

  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Cập nhật trạng thái phòng
const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái là bắt buộc'
      });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái phòng thành công',
      data: room
    });

  } catch (error) {
    console.error('Update room status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy danh sách phòng có sẵn
const getAvailableRooms = async (req, res) => {
  try {
    const { 
      checkIn, 
      checkOut, 
      roomType, 
      guests = 1 
    } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Ngày check-in và check-out là bắt buộc'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Ngày check-out phải sau ngày check-in'
      });
    }

    // Tìm phòng có sẵn
    const filter = {
      isActive: true,
      status: 'available',
      capacity: { $gte: Number(guests) }
    };

    if (roomType) filter.roomType = roomType;

    const availableRooms = await Room.find(filter).sort({ price: 1 });

    res.json({
      success: true,
      data: availableRooms,
      total: availableRooms.length
    });

  } catch (error) {
    console.error('Get available rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
  getAvailableRooms
};
