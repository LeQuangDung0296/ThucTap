const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getUserBookings, 
  getBookingById, 
  updateBookingStatus, 
  cancelBooking,
  getAllBookings,
  getBookingStats
} = require('../controllers/bookingController');
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

// Tất cả routes đều cần đăng nhập
router.use(authenticateToken);

// User routes
router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/my-bookings/:id', getBookingById);
router.post('/:id/cancel', cancelBooking);

// Admin only routes
router.get('/', requireAdmin, getAllBookings);
router.get('/stats', requireAdmin, getBookingStats);
router.patch('/:id/status', requireAdmin, updateBookingStatus);

module.exports = router;
