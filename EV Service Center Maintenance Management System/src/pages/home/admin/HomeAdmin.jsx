import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  DollarSign,
  BarChart3,
  Bell,
  Car,
  ClipboardCheck,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const HomeAdmin = () => {
  const navigate = useNavigate();

  // Dashboard + Notifications
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    vehicles: 0,
    pendingAssignments: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef();

  // Admin Management
  const [admins, setAdmins] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminFormData, setAdminFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Load dashboard and admins
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Dashboard data
        const dashboardRes = await axios.get(
          "http://localhost:8080/api/admin/dashboard"
        );
        const data = dashboardRes.data;
        setStats({
          users: data.users ?? 0,
          revenue: data.revenue ?? 0,
          vehicles: data.vehicles ?? 0,
          pendingAssignments: data.pendingAssignments ?? 0,
        });
        setNotifications(data.notifications || []);

        // Admin list
        const adminRes = await axios.get("http://localhost:8080/api/admin/getAll"); // Assuming you have a getAll
        setAdmins(adminRes.data);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Click outside notifications to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dashboard charts demo data
  const revenueData = [
    { month: "T1", revenue: 4000 },
    { month: "T2", revenue: 3500 },
    { month: "T3", revenue: 5200 },
    { month: "T4", revenue: 4800 },
    { month: "T5", revenue: 6100 },
    { month: "T6", revenue: 7300 },
  ];

  const maintenanceData = [
    { month: "T1", jobs: 8 },
    { month: "T2", jobs: 10 },
    { month: "T3", jobs: 14 },
    { month: "T4", jobs: 12 },
    { month: "T5", jobs: 16 },
    { month: "T6", jobs: 20 },
  ];

  const recentJobs = [
    {
      id: 1,
      car: "VF8",
      service: "Bảo dưỡng định kỳ",
      staff: "Nguyễn Văn A",
      status: "Đang thực hiện",
    },
    {
      id: 2,
      car: "VF5",
      service: "Thay pin",
      staff: "",
      status: "Chờ phân công",
    },
    {
      id: 3,
      car: "VF9",
      service: "Kiểm tra động cơ",
      staff: "Lê Minh B",
      status: "Hoàn thành",
    },
  ];

  // ================= Admin CRUD =================
  const handleSaveAdmin = async () => {
    if (!adminFormData.name || !adminFormData.email || !adminFormData.phone) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    try {
      if (editingAdmin) {
        await axios.put(
          `http://localhost:8080/api/admin/update/${editingAdmin.id}`,
          adminFormData
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/admin/register",
          adminFormData
        );
      }

      // Reload admin list
      const res = await axios.get("http://localhost:8080/api/admin/getAll");
      setAdmins(res.data);

      setShowAdminForm(false);
      setEditingAdmin(null);
      setAdminFormData({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      console.error("❌ Lỗi khi lưu admin:", err);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa admin này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/delete/${id}`);
        setAdmins(admins.filter((a) => a.id !== id));
      } catch (err) {
        console.error("❌ Lỗi khi xóa admin:", err);
      }
    }
  };

  // ================= Render =================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col z-10">
        {/* Top bar */}
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-white/30 p-4 shadow-md">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Trang quản trị
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-3 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            />
            <div ref={notifRef} className="relative cursor-pointer">
              <Bell
                className="w-6 h-6 text-gray-600 hover:text-emerald-600 transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-8 w-64 max-h-72 overflow-y-auto bg-white/90 backdrop-blur-xl shadow-lg rounded-xl z-20 border border-gray-100">
                  {notifications.length === 0 ? (
                    <p className="p-2 text-gray-500 text-sm">
                      Không có thông báo
                    </p>
                  ) : (
                    admins.map((note, i) => (
                      <p
                        key={i}
                        className="p-2 border-b last:border-b-0 text-gray-700 text-sm hover:bg-emerald-50"
                      >
                        {note.name}
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>
            <div
              onClick={() => navigate("/admin/profile")}
              className="w-9 h-9 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full cursor-pointer shadow-md hover:scale-105 transition-transform"
              title="Profile"
            />
          </div>
        </header>

        {/* Main dashboard */}
        <main className="p-6 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <p className="text-gray-500">⏳ Đang tải dữ liệu...</p>
          ) : (
            <>
              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Người dùng"
                  value={stats.users}
                  color="from-blue-400 to-blue-600"
                  icon={<Users className="w-8 h-8 text-white" />}
                  onClick={() => navigate("/admin/users")}
                />
                <StatCard
                  title="Doanh thu"
                  value={`${stats.revenue}$`}
                  color="from-emerald-400 to-emerald-600"
                  icon={<DollarSign className="w-8 h-8 text-white" />}
                  onClick={() => navigate("/admin/revenue")}
                />
                <StatCard
                  title="Xe đang bảo dưỡng"
                  value={stats.vehicles}
                  color="from-yellow-400 to-yellow-600"
                  icon={<Car className="w-8 h-8 text-white" />}
                  onClick={() => navigate("/admin/schedule")}
                />
                <StatCard
                  title="Công việc chờ phân công"
                  value={stats.pendingAssignments}
                  color="from-indigo-400 to-indigo-600"
                  icon={<ClipboardCheck className="w-8 h-8 text-white" />}
                  onClick={() => navigate("/admin/assignments")}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard
                  title="Biểu đồ doanh thu hàng tháng"
                  data={revenueData}
                  dataKey="revenue"
                  color="#10b981"
                />
                <ChartCard
                  title="Biểu đồ bảo dưỡng xe theo tháng"
                  data={maintenanceData}
                  dataKey="jobs"
                  color="#f59e0b"
                />
              </div>

              {/* Admin List Table */}
              <div className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow-xl mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-700">
                    Quản lý Admin
                  </h2>
                  <button
                    onClick={() => setShowAdminForm(true)}
                    className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md transition"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Thêm Admin
                  </button>
                </div>
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-emerald-100 text-gray-700 uppercase text-sm">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Tên</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Số điện thoại</th>
                      <th className="px-4 py-3 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      admins.map((admin) => (
                        <tr
                          key={admin.id}
                          className="border-b border-gray-300 last:border-b-0 hover:bg-emerald-50 transition"
                        >
                          <td className="px-4 py-2">{admin.id}</td>
                          <td className="px-4 py-2">{admin.name}</td>
                          <td className="px-4 py-2">{admin.email}</td>
                          <td className="px-4 py-2">{admin.phone}</td>
                          <td className="px-4 py-2 flex justify-center space-x-3">
                            <button
                              onClick={() => {
                                setEditingAdmin(admin);
                                setAdminFormData({
                                  name: admin.name,
                                  email: admin.email,
                                  phone: admin.phone,
                                  password: "",
                                });
                                setShowAdminForm(true);
                              }}
                              className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin.id)}
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
            </>
          )}
        </main>
      </div>

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingAdmin ? "Sửa Admin" : "Thêm Admin"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                value={adminFormData.name}
                onChange={(e) =>
                  setAdminFormData({ ...adminFormData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                value={adminFormData.email}
                onChange={(e) =>
                  setAdminFormData({ ...adminFormData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                value={adminFormData.phone}
                onChange={(e) =>
                  setAdminFormData({ ...adminFormData, phone: e.target.value })
                }
              />
              {!editingAdmin && (
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                  value={adminFormData.password}
                  onChange={(e) =>
                    setAdminFormData({ ...adminFormData, password: e.target.value })
                  }
                />
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAdminForm(false);
                  setEditingAdmin(null);
                  setAdminFormData({ name: "", email: "", phone: "", password: "" });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAdmin}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow"
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

// StatCard & ChartCard (reuse from your previous code)
const StatCard = ({ title, value, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="p-6 rounded-3xl shadow-xl bg-white/80 backdrop-blur flex items-center justify-between hover:scale-105 transition-transform cursor-pointer"
  >
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-md`}>{icon}</div>
  </div>
);

const ChartCard = ({ title, data, dataKey, color }) => (
  <div className="p-6 rounded-3xl shadow-xl bg-white/80 backdrop-blur">
    <h2 className="text-lg font-bold mb-4 text-gray-700">{title}</h2>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill={color} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default HomeAdmin;
