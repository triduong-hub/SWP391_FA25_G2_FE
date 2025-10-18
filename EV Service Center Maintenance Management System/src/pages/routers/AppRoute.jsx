import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Import LanguageProvider
import { LanguageProvider } from "../../contexts/LanguageContext.jsx";

// Trang login & password
import LoginPage from "../login/LoginPage.jsx";
import ForgotPasswordPage from "../password/ForgotPasswordPage.jsx";

// Trang Technician
import TechnicianDashboard from "../home/Technician/TechnicianDashboard.jsx";

// Trang Staff
import StaffDashboard from "../home/staff/StaffDashboard.jsx";

// Layout Admin
import AdminLayout from "../home/admin/AdminLayout.jsx";

// Trang con của Admin
import HomeAdmin from "../home/admin/HomeAdmin.jsx";
import ProfileAdmin from "../home/admin/ProfileAdmin.jsx";
import UserManagement from "../home/UserManagement.jsx";
import HomeStaff from "../home/HomeStaff.jsx";
import ScheduleManagement from "../home/ScheduleManagement.jsx";
import CarManagement from "../home/CarManagement.jsx";
import SystemManagement from "../home/SystemManagement.jsx";
import RevenueManagement from "../home/RevenueManagement.jsx";
import TechnicianManagement from "../home/TechnicianManagement.jsx";

// Trang chủ (HomePage) và trang cá nhân (Profile)
import HomePage from "../home/users/HomePage.jsx";
import Profile from "../home/users/Profile.jsx";
// Trang đặt lịch (Booking Page)
import BookingPage from "../booking/BookingPage.jsx";

function AppRoute() {
  return (
    // ✅ Toàn bộ Route được bao trong LanguageProvider
    <LanguageProvider>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />
        
        {/* Trang cá nhân */}
        <Route path="/profile" element={<Profile />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        
         {/* Technician */}
        <Route path="/techniciandash" element={<TechnicianDashboard />} />

         {/* Staff */}
        <Route path="/staffdash" element={<StaffDashboard />} />

        {/* Trang quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Trang đặt lịch bảo dưỡng */}
        <Route path="/booking" element={<BookingPage />} />

        {/* Các route trong Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="profile" element={<ProfileAdmin />} />
          <Route path="home" element={<HomeAdmin />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="staff" element={<HomeStaff />} />
          <Route path="cars" element={<CarManagement />} />
          <Route path="schedule" element={<ScheduleManagement />} />
          <Route path="revenue" element={<RevenueManagement />} />
          <Route path="settings" element={<SystemManagement />} />
          <Route path="technician" element={<TechnicianManagement/>} />
          {/* <Route path="assignments" element={<TechnicianManagement />} /> */}

        </Route>
      </Routes>
    </LanguageProvider>
  );
}

export default AppRoute;
