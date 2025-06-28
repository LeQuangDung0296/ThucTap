const express = require('express');
const router = express.Router();
const { 
  getAllRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom, 
  updateRoomStatus,
  getAvailableRooms 
} = require('../controllers/roomController');
const { authenticateToken } = require('../controllers/authController');

// Middleware kiểm tra quyền admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ admin mới có quyền truy cập'
    });
  }
  next();
};

// Public routes (không cần đăng nhập)
router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);

// Protected routes (cần đăng nhập)
router.use(authenticateToken);

// Admin only routes
router.post('/', requireAdmin, createRoom);
router.put('/:id', requireAdmin, updateRoom);
router.delete('/:id', requireAdmin, deleteRoom);
router.patch('/:id/status', requireAdmin, updateRoomStatus);

module.exports = router;
