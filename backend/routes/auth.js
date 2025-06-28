const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser, authenticateToken } = require('../controllers/authController');

// Route đăng ký
router.post('/register', register);

// Route đăng nhập
router.post('/login', login);

// Route đăng xuất
router.post('/logout', logout);

// Route lấy thông tin user hiện tại (cần xác thực)
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
