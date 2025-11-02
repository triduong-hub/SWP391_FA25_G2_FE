import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import API from "../../../api";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  

  // 🔹 Lấy danh sách người dùng
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/customer/getAll");
      console.log("📦 Dữ liệu users:", res.data);
      setUsers(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("❌ Lỗi khi load users:", err);
    }
  };

  // 🔹 Lưu (tạo mới hoặc update)
  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đủ Tên, Email và Số điện thoại!",
      });
      return;
    }

    try {
      if (editingUser) {
        await API.put(`/customer/update/${editingUser.customerID}`, formData);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await API.post("/customer/create", formData);
        Swal.fire({
          icon: "success",
          title: "Thêm người dùng thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      await fetchUsers(); // cập nhật lại danh sách
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error("❌ Lỗi khi lưu user:", err);
    }
  };

  // 🔹 Xóa
  const handleDelete = async (customerID) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa người dùng?",
      text: "Bạn có chắc muốn xóa người dùng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/customer/${customerID}`);
        setUsers(users.filter((u) => u.customerID !== customerID));
        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi xóa!",
          text: "Không thể xóa người dùng, vui lòng thử lại.",
        });
      }
    }
  };

  // 🔹 Lọc danh sách theo tìm kiếm
  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.phone].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h2>

        {/* 🔹 Nút thêm mới */}
        {/* <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", email: "", phone: "" });
            setShowForm(true);
          }}
          className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm mới
        </button> */}
      </div>

      {/* 🔍 Thanh tìm kiếm */}
      <div className="flex items-center border border-gray-300 rounded-xl px-2 bg-white/90 backdrop-blur w-80 mb-4 shadow-sm">
        <Search className="w-4 h-4 text-emerald-600" />
        <input
          type="text"
          placeholder="Tìm kiếm tên, email, số điện thoại..."
          className="px-2 py-2 outline-none w-full bg-transparent text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔹 Bảng danh sách */}
      <div className="overflow-x-auto bg-white/90 backdrop-blur rounded-2xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 uppercase text-sm">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.customerID}
                  className="border-b border-gray-300 last:border-b-0 hover:bg-emerald-50 transition"
                >
                  <td className="px-4 py-2 text-gray-700">{user.customerID}</td>
                  <td className="px-4 py-2 text-gray-800">{user.name}</td>
                  <td className="px-4 py-2 text-gray-600">{user.email}</td>
                  <td className="px-4 py-2 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-2 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                        });
                        setShowForm(true);
                      }}
                      className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.customerID)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧩 Form thêm/sửa người dùng */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
            </h3>

            <input
              type="text"
              placeholder="Tên"
              className="border w-full p-2 mb-3 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border w-full p-2 mb-3 rounded-md"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border w-full p-2 mb-3 rounded-md"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
