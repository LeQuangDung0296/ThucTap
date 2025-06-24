import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken, getToken } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Xin chào quản trị viên!</h2>
      <p>Chào mừng bạn đến với hệ thống quản lý đặt phòng khách sạn.</p>

      <div className="button-group">
        <button onClick={() => navigate('/rooms')}>Quản lý phòng</button>
        <button onClick={() => navigate('/bookings')}>Quản lý đặt phòng</button>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  );
};

export default Dashboard;
