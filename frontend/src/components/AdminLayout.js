import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AdminLayout = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Hệ thống quản lý khách sạn</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Xin chào, {currentUser?.username || 'Admin'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Đăng xuất
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 