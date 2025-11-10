import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, UserCircle } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">
          Đang tải thông tin người dùng...
        </p>
      </div>
    );
  }

  const genderText =
    user.gender === "male"
      ? "Nam"
      : user.gender === "female"
      ? "Nữ"
      : "Không xác định";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-8 text-center text-white relative">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={user.avatar || "/avatar.jpg"}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg mx-auto mb-4 object-cover"
          />
          <h1 className="text-2xl font-bold tracking-tight">
            {user.name?.trim() || "Người dùng"}
          </h1>
          <p className="text-sm opacity-90 mt-1">{user.email}</p>
        </div>

        {/* Body */}
        <div className="p-8 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Tên</p>
                <p className="text-base font-semibold text-gray-800">
                  {user.name?.trim() || "Không có"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-base font-semibold text-gray-800">
                  {user.email || "Không có"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Số điện thoại</p>
                <p className="text-base font-semibold text-gray-800">
                  {user.phone || "Không có"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
                <UserCircle size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Giới tính</p>
                <p className="text-base font-semibold text-gray-800">
                  {genderText}
                </p>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="mt-10 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Quay lại trang chủ
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
