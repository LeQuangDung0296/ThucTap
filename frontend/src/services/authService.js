import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo axios instance với base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Đăng nhập
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Đổi mật khẩu
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Làm mới token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 