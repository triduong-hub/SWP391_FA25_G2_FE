import React, { useState, useEffect } from "react";

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 min-h-screen rounded-2xl space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">
        ⚙️ Quản lý Hệ thống
      </h2>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-emerald-200 pb-2">
        {[
          { id: "general", label: "Cấu hình chung" },
          { id: "roles", label: "Quản lý phân quyền" },
          { id: "logs", label: "Nhật ký hệ thống" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 px-2 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-emerald-500 text-emerald-600 font-semibold"
                : "text-gray-600 hover:text-emerald-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      {activeTab === "general" && <GeneralSettings />}
      {activeTab === "roles" && <RoleManagement />}
      {activeTab === "logs" && <SystemLogs />}
    </div>
  );
};

// ==================== TAB 1: Cấu hình chung ====================
const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    systemName: "",
    contactEmail: "",
    logoUrl: "",
  });

  useEffect(() => {
    setSettings({
      systemName: "EV Service Center",
      contactEmail: "support@evcenter.com",
      logoUrl: "",
    });
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("💾 Đã lưu cấu hình!");
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-xl shadow p-6 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm text-gray-600">Tên hệ thống</label>
        <input
          type="text"
          name="systemName"
          value={settings.systemName}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Email liên hệ</label>
        <input
          type="email"
          name="contactEmail"
          value={settings.contactEmail}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Logo (URL)</label>
        <input
          type="text"
          name="logoUrl"
          value={settings.logoUrl}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
      >
         Lưu thay đổi
      </button>
    </div>
  );
};

// ==================== TAB 2: Quản lý phân quyền ====================
const RoleManagement = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setRoles([
      { id: 1, name: "Admin", permissions: ["Quản lý tất cả"] },
      { id: 2, name: "Staff", permissions: ["Xem & xử lý bảo dưỡng"] },
      { id: 3, name: "Customer", permissions: ["Xem thông tin xe", "Đặt lịch"] },
    ]);
  }, []);

  const handleAdd = () => {
    alert("➕ Thêm role mới");
  };

  const handleEdit = (id) => {
    alert("✏️ Sửa role ID: " + id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa role ID: " + id + " ?")) {
      setRoles(roles.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Danh sách vai trò</h3>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          ➕ Thêm vai trò
        </button>
      </div>

      <table className="w-full border-collapse text-gray-900">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
            <th className="p-3">ID</th>
            <th className="p-3">Tên vai trò</th>
            <th className="p-3">Quyền</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr
              key={role.id}
              className="border-b hover:bg-emerald-50/50 transition"
            >
              <td className="p-3">{role.id}</td>
              <td className="p-3">{role.name}</td>
              <td className="p-3">{role.permissions.join(", ")}</td>
              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => handleEdit(role.id)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== TAB 3: Nhật ký hệ thống ====================
const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  const fetchLogs = async (date = "") => {
    setLoading(true);
    try {
      const demoData = [
        {
          id: 1,
          user: "Admin",
          action: "Đăng nhập hệ thống",
          timestamp: "2025-09-26 09:15:00",
        },
        {
          id: 2,
          user: "Staff A",
          action: "Thêm lịch bảo dưỡng cho xe #EV123",
          timestamp: "2025-09-26 10:05:00",
        },
        {
          id: 3,
          user: "Customer B",
          action: "Đặt lịch bảo dưỡng",
          timestamp: "2025-09-26 10:30:00",
        },
      ];

      const filtered =
        date === ""
          ? demoData
          : demoData.filter((log) => log.timestamp.startsWith(date));

      setLogs(filtered);
    } catch (error) {
      console.error("Lỗi khi tải logs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs(filterDate);
  }, [filterDate]);

  return (
    <div>
      {/* Bộ lọc */}
      <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow mb-4 flex items-center gap-4">
        <label className="text-sm text-gray-600">Lọc theo ngày:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button
          onClick={() => fetchLogs(filterDate)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          🔍 Tìm kiếm
        </button>
        <button
          onClick={() => {
            setFilterDate("");
            fetchLogs("");
          }}
          className="bg-gradient-to-r from-gray-400 to-gray-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          Reset
        </button>
      </div>

      {/* Bảng logs */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">⏳ Đang tải dữ liệu...</p>
        ) : logs.length === 0 ? (
          <p className="p-4 text-gray-500">⚠️ Không có nhật ký nào.</p>
        ) : (
          <table className="w-full border-collapse text-gray-900">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">Người dùng</th>
                <th className="p-3">Hành động</th>
                <th className="p-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-emerald-50/50 transition"
                >
                  <td className="p-3">{log.id}</td>
                  <td className="p-3">{log.user}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SystemManagement;
