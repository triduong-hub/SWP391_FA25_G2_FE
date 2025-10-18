import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileAdmin = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch admin info based on logged-in admin ID
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const adminId = localStorage.getItem("id"); // ✅ ID stored at login

        if (!adminId) {
          throw new Error("Không tìm thấy ID admin. Vui lòng đăng nhập lại.");
        }

        const res = await axios.get(
          `http://localhost:8080/api/admin/getby/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data?.data || res.data;
        setAdmin({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin admin:", error);
        alert("Không thể tải thông tin admin. Hãy đăng nhập lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  // ✅ Handle save/update
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("id");

      if (!adminId) {
        throw new Error("Không tìm thấy ID admin. Vui lòng đăng nhập lại.");
      }

      const res = await axios.put(
        `http://localhost:8080/api/admin/update/${adminId}`,
        admin,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Cập nhật thông tin thành công!");
      setAdmin(res.data.data); // cập nhật lại dữ liệu mới
      setEditing(false);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại. Kiểm tra lại dữ liệu.");
    }
  };

  if (loading) return <p className="p-4 text-gray-500">⏳ Đang tải thông tin...</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 min-h-screen rounded-2xl space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin Quản trị viên</h2>

      <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow space-y-4 w-full sm:w-1/2">
        <div>
          <label className="block font-medium text-gray-700">Họ và tên</label>
          <input
            type="text"
            value={admin.name}
            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
            disabled={!editing}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            disabled
            className="border border-gray-300 px-3 py-2 rounded w-full bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Số điện thoại</label>
          <input
            type="text"
            value={admin.phone}
            onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
            disabled={!editing}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100"
          />
        </div>

        <div className="flex gap-3 mt-4">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow"
            >
              ✏️ Chỉnh sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow"
              >
                💾 Lưu thay đổi
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow"
              >
                ❌ Hủy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;
