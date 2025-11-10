import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api"; // Đường dẫn axios config

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // 🔹 Lấy token từ URL: /reset-password?token=abc123
      const token = searchParams.get("token");

      if (!token) {
        setMessage("❌ Thiếu mã xác thực (token) trong đường dẫn!");
        return;
      }

      // 🔹 Gửi yêu cầu reset mật khẩu
      const res = await api.post("/auth/reset-password", {
        token: token,
        newPassword: newPassword,
      });

      console.log("✅ Reset password success:", res.data);
      setMessage("✅ Đặt lại mật khẩu thành công! Chuyển về đăng nhập...");
      
      // 🔹 Chuyển về trang đăng nhập sau 2 giây
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Reset password error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Không thể đặt lại mật khẩu!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            required
          />
          {message && (
            <p className="text-center text-sm font-semibold text-red-600">{message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-blue-600 transition-all"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
