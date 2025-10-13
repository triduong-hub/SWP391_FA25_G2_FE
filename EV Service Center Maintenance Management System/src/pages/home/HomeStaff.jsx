import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import axios from "axios";

const HomeStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Đang làm việc",
  });

  // 🧾 Lấy danh sách nhân viên
  const fetchStaffData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/staff");
      setStaffList(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  // 💾 Thêm / sửa
  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }
    try {
      if (editingStaff) {
        await axios.put(
          `http://localhost:8080/api/staff/${editingStaff.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:8080/api/staff", formData);
      }
      await fetchStaffData();
      setShowForm(false);
      setEditingStaff(null);
      setFormData({ name: "", email: "", role: "", status: "Đang làm việc" });
    } catch (err) {
      console.error("Lỗi khi lưu nhân viên:", err);
    }
  };

  // ❌ Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này không?")) {
      try {
        await axios.delete(`http://localhost:8080/api/staff/${id}`);
        setStaffList(staffList.filter((s) => s.id !== id));
      } catch (err) {
        console.error("Lỗi khi xóa nhân viên:", err);
      }
    }
  };

  // 🔍 Tìm kiếm + Lọc
  const filteredStaff = staffList.filter((s) => {
    const matchSearch = [s.name, s.email, s.role].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 min-h-screen rounded-2xl space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">
        👥 Quản lý Nhân viên
      </h2>

      {/* Bộ công cụ */}
      <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
        {/* Ô tìm kiếm */}
        <div className="flex items-center border border-gray-300 rounded px-3 py-2 w-80 focus-within:ring-2 focus-within:ring-emerald-500">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            className="w-full outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bộ lọc */}
        <select
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="Đang làm việc">Đang làm việc</option>
          <option value="Nghỉ việc">Nghỉ việc</option>
        </select>

        {/* Nút thêm */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm nhân viên
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">⏳ Đang tải dữ liệu...</p>
        ) : (
          <table className="w-full border-collapse text-gray-900">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">Họ và tên</th>
                <th className="p-3">Email</th>
                <th className="p-3">Vai trò</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    ⚠️ Không có dữ liệu.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-emerald-50/50 transition"
                  >
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.role}</td>
                    <td
                      className={`p-3 font-medium ${
                        item.status === "Đang làm việc"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingStaff(item);
                          setFormData(item);
                          setShowForm(true);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal thêm / sửa */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-96 shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              {editingStaff ? "✏️ Sửa nhân viên" : "➕ Thêm nhân viên"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên nhân viên"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Vai trò"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
              <select
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Nghỉ việc">Nghỉ việc</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingStaff(null);
                  setFormData({
                    name: "",
                    email: "",
                    role: "",
                    status: "Đang làm việc",
                  });
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:opacity-90 shadow"
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

export default HomeStaff;
