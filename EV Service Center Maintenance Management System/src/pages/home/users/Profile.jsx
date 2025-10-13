import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user info from localStorage or API
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Example: get user data stored locally (if you saved it after login)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Thông tin cá nhân
      </h1>
      <div className="flex flex-col items-center">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full border border-gray-300 mb-4"
        />
        <div className="w-full space-y-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Tên:</span>
            <span className="text-gray-800">{user.name || "Không có"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-800">{user.email || "Không có"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Số điện thoại:</span>
            <span className="text-gray-800">{user.phone || "Không có"}</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default Profile;
