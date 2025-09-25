import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../login/LoginPage.jsx";
import ForgotPasswordPage from "../password/ForgotPasswordPage.jsx";

function AppRoute() {
  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route path="/" element={<LoginPage />} />

      {/* Trang quên mật khẩu */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  );
}

export default AppRoute;
