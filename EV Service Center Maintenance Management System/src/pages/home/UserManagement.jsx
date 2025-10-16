import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import API from "../../../api"; // ✅ dùng API.js

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 🔹 Gọi API bằng API.js
        const res = await API.get("/customer/getAll");
        console.log("📦 Dữ liệu users:", res.data);
        setUsers(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("❌ Lỗi khi load users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    try {
      if (editingUser) {
        await API.put(`/customer/update/${editingUser.customerID}`, formData);
      } else {
        await API.post("/customer/create", formData);
      }
      const res = await API.get("/users");
      setUsers(res.data);

      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: "", email: "", phone: "" });
    } catch (err) {
      console.error("❌ Lỗi khi lưu user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa user này không?")) {
      try {
        await API.delete(`/customer/${id}`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        console.error("❌ Lỗi khi xóa user:", err);
      }
    }
  };

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.phone].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h2>
        {/* <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm mới
        </button> */}
      </div>

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
                      onClick={() => handleDelete(user.id)}
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
    </div>
  );
};

export default UserManagement;
