// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home";
import RoomManagement from "./pages/RoomManagement";
import BookingManagement from "./pages/BookingManagement";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { authService } from "./services/authService";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route công khai */}
        <Route 
          path="/login" 
          element={
            authService.isAuthenticated() ? 
            <Navigate to="/" replace /> : 
            <Login />
          } 
        />
        
        {/* Routes được bảo vệ */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
        </Route>

        {/* Redirect mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;