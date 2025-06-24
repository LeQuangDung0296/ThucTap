import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear login error khi user thay đổi input
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Gọi API đăng nhập thông qua authService
      const response = await authService.login(formData.username, formData.password);

      if (response.token) {
        // Lưu token và user info vào localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Chuyển hướng đến trang chủ
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        // Server trả về lỗi
        const errorMessage = error.response.data.message || 'Đăng nhập thất bại';
        setLoginError(errorMessage);
      } else if (error.request) {
        // Không thể kết nối đến server
        setLoginError('Không thể kết nối đến server. Vui lòng thử lại sau.');
      } else {
        // Lỗi khác
        setLoginError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Đăng nhập</h1>
          <p>Hệ thống quản lý đặt phòng khách sạn</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {loginError && (
            <div className="error-message">
              <span>⚠️</span>
              {loginError}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={errors.username ? 'error' : ''}
              placeholder="Nhập tên đăng nhập"
              disabled={isLoading}
            />
            {errors.username && (
              <div className="error-message">
                <span>⚠️</span>
                {errors.username}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={errors.password ? 'error' : ''}
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
            />
            {errors.password && (
              <div className="error-message">
                <span>⚠️</span>
                {errors.password}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
          
          <div className="forgot-password">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
