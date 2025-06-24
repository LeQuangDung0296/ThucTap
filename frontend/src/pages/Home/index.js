import React from 'react';
import { authService } from '../../services/authService';

const Home = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Chào mừng đến với hệ thống quản lý khách sạn!</h1>
      <p>Bạn đã đăng nhập thành công với tài khoản: <strong>{currentUser?.username}</strong></p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        marginTop: '3rem' 
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Quản lý phòng</h3>
          <p>Thêm, sửa, xóa và quản lý thông tin các phòng trong khách sạn</p>
        </div>
        
        <div style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Quản lý đặt phòng</h3>
          <p>Xem danh sách, xác nhận và quản lý các đơn đặt phòng</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 