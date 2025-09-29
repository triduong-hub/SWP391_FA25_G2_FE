import React from "react";
import { Routes, Route } from "react-router-dom";

// Trang login & password
import LoginPage from "../login/LoginPage.jsx";
import ForgotPasswordPage from "../password/ForgotPasswordPage.jsx";

// Layout Admin
import AdminLayout from "../home/admin/AdminLayout.jsx";

// Trang con của Admin
import HomeAdmin from "../home/admin/HomeAdmin.jsx";
import UserManagement from "../home/UserManagement.jsx";
import HomeStaff from "../home/HomeStaff.jsx";
import ScheduleManagement from "../home/ScheduleManagement.jsx";
import CarManagement from "../home/CarManagement.jsx";
import SystemManagement from "../home/SystemManagement.jsx";
import RevenueManagement from "../home/RevenueManagement.jsx";

// Trang chủ (HomePage)
import HomePage from "../home/users/HomePage.jsx";

function AppRoute() {
  return (
    <Routes>
      {/* Trang chủ */}
      <Route path="/" element={<HomePage />} />

      {/* Trang đăng nhập */}
      <Route path="/login" element={<LoginPage />} />

      {/* Trang quên mật khẩu */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Các route trong Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="home" element={<HomeAdmin />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="staff" element={<HomeStaff />} />
        <Route path="cars" element={<CarManagement />} />
        <Route path="schedule" element={<ScheduleManagement />} />
        <Route path="revenue" element={<RevenueManagement />} />
        <Route path="settings" element={<SystemManagement />} />
      </Route>
    </Routes>
  );
}

export default AppRoute;
