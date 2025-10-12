import React, { useState, useEffect } from "react";
<<<<<<< Updated upstream
import axios from "axios";
=======
import { AdminAPI } from "../../../api/adminApi";
>>>>>>> Stashed changes
import { User, Mail, Phone, Shield, Edit3 } from "lucide-react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
<<<<<<< Updated upstream
    name: "Nguyễn Quản Trị",
    email: "admin@evcenter.vn",
    phone: "0901 234 567",
=======
    name: "",
    email: "",
    phone: "",
    phone: "",
>>>>>>> Stashed changes
    role: "Quản trị viên",
    avatar: "/default-avatar.png",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

<<<<<<< Updated upstream
  // Giả lập API call
=======
>>>>>>> Stashed changes
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
<<<<<<< Updated upstream
        const res = await axios.get("http://localhost:8080/api/admin/profile");
        setAdmin(res.data || admin);
=======
        const res = await AdminAPI.getById(1);
        setAdmin(res.data.data || admin);
>>>>>>> Stashed changes
      } catch (err) {
        console.warn("⚠️ Không thể tải thông tin admin, dùng dữ liệu mẫu.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

<<<<<<< Updated upstream
  const handleSave = () => {
    // Gửi API cập nhật
    console.log("Lưu thông tin:", admin);
    setEditing(false);
=======
  const handleSave = async () => {
    try {
      const res = await AdminAPI.update(1, admin);
      alert("✅ Thông tin đã được cập nhật!");
      setAdmin(res.data.data || admin);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("❌ Cập nhật thất bại!");
    } finally {
      setEditing(false);
    }
>>>>>>> Stashed changes
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col z-10">
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-white/30 p-4 shadow-md">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Hồ sơ quản trị viên
          </h1>
        </header>

        <main className="flex-1 p-8 flex justify-center items-start">
          <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 w-full max-w-3xl relative">
            {loading ? (
              <p className="text-gray-500 text-center">⏳ Đang tải thông tin...</p>
            ) : (
              <>
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={admin.avatar}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full border-4 border-emerald-400 shadow-lg object-cover"
                    />
                    <button
                      className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-white rounded-full shadow hover:bg-emerald-600"
                      title="Đổi ảnh đại diện"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-700">
                    {admin.name}
                  </h2>
                  <p className="text-gray-500">{admin.role}</p>
                </div>

                {/* Thông tin chi tiết */}
                <div className="space-y-4">
                  <ProfileField
                    icon={<Mail className="w-5 h-5 text-emerald-500" />}
                    label="Email"
                    name="email"
                    value={admin.email}
                    editing={editing}
                    onChange={handleChange}
                  />
                  <ProfileField
                    icon={<Phone className="w-5 h-5 text-emerald-500" />}
                    label="Số điện thoại"
                    name="phone"
                    value={admin.phone}
                    editing={editing}
                    onChange={handleChange}
                  />
                  <ProfileField
                    icon={<Shield className="w-5 h-5 text-emerald-500" />}
                    label="Chức vụ"
                    name="role"
                    value={admin.role}
                    editing={editing}
                    onChange={handleChange}
                  />
                </div>

                {/* Nút chỉnh sửa / lưu */}
                <div className="mt-8 flex justify-end space-x-4">
                  {editing ? (
                    <>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
                      >
                        Lưu thay đổi
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// 🔹 Component hiển thị từng trường thông tin
const ProfileField = ({ icon, label, value, name, editing, onChange }) => (
  <div className="flex items-center space-x-3 bg-white/70 rounded-2xl p-4 shadow-sm">
    {icon}
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border-b border-emerald-300 bg-transparent focus:outline-none focus:border-emerald-500 text-gray-700"
        />
      ) : (
        <p className="text-gray-700 font-medium">{value}</p>
      )}
    </div>
  </div>
);

export default AdminProfile;
