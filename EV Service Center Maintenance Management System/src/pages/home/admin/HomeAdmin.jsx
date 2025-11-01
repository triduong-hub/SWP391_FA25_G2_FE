import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, DollarSign, Bell, Car, ClipboardCheck } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import API from "../../../../api"; // ✅ Use your centralized API instance

const HomeAdmin = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    vehicles: 0,
    pendingAssignments: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [admin, setAdmin] = useState(null);

  const notifRef = useRef();
  const profileRef = useRef();

  // ✅ Load Admin Info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        const token = localStorage.getItem("token");
        if (!adminId || !token) return;

        const res = await API.get(`/admin/getby/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data?.data || res.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin Admin:", error);
      }
    };
    fetchAdmin();
  }, []);

  // ✅ Load Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/dashboard");
        const data = res.data;
        setStats({
          users: data.users ?? 0,
          revenue: data.revenue ?? 0,
          vehicles: data.vehicles ?? 0,
          pendingAssignments: data.pendingAssignments ?? 0,
        });
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
        // fallback demo
        setStats({
          users: 1200,
          revenue: 45800,
          vehicles: 24,
          pendingAssignments: 6,
        });
        setNotifications([
          "Có 3 xe mới cần bảo dưỡng",
          "Người dùng mới đăng ký: Trần Văn C",
          "Xe VF8 đã hoàn tất bảo dưỡng",
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    navigate("/login");
  };

  // Demo chart data
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
    { id: 1, car: "VF8", service: "Bảo dưỡng định kỳ", staff: "Nguyễn Văn A", status: "Đang thực hiện" },
    { id: 2, car: "VF5", service: "Thay pin", staff: "", status: "Chờ phân công" },
    { id: 3, car: "VF9", service: "Kiểm tra động cơ", staff: "Lê Minh B", status: "Hoàn tất" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="flex-1 flex flex-col z-10">
        {/* Header */}
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

            {/* 🔔 Notifications */}
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
                    <p className="p-2 text-gray-500 text-sm">Không có thông báo</p>
                  ) : (
                    notifications.map((note, i) => (
                      <p
                        key={i}
                        className="p-2 border-b last:border-b-0 text-gray-700 text-sm hover:bg-emerald-50"
                      >
                        {note}
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 👤 Profile dropdown (only Đăng xuất) */}
            <div ref={profileRef} className="relative cursor-pointer">
              <div
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full shadow hover:bg-white transition"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {admin ? admin.name?.charAt(0)?.toUpperCase() : "A"}
                </div>
                <span className="text-gray-700 font-medium">
                  {admin ? admin.name : "Admin"}
                </span>
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <main className="p-6 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <p className="text-gray-500">⏳ Đang tải dữ liệu...</p>
          ) : (
            <>
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
                  title="Lịch bảo dưỡng"
                  value={stats.vehicles}
                  color="from-yellow-400 to-yellow-600"
                  icon={<Car className="w-8 h-8 text-white" />}
                  onClick={() => navigate("/admin/schedule")}
                />
                <StatCard
                  title="Xe điện"
                  value={stats.pendingAssignments}
                  color="from-indigo-400 to-indigo-600"
                  icon={<ClipboardCheck className="w-8 h-8 text-white" />}
                  onClick={() => navigate("/admin/cars")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Biểu đồ doanh thu hàng tháng" data={revenueData} dataKey="revenue" color="#10b981" />
                <ChartCard title="Biểu đồ bảo dưỡng xe theo tháng" data={maintenanceData} dataKey="jobs" color="#f59e0b" />
              </div>

              <div className="bg-white/80 backdrop-blur p-6 rounded-3xl shadow-xl mt-6">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Công việc bảo dưỡng gần đây</h2>
                <table className="w-full text-sm">
                  <thead className="bg-emerald-500 text-white">
                    <tr>
                      <th className="p-3 text-left">Xe</th>
                      <th className="p-3 text-left">Dịch vụ</th>
                      <th className="p-3 text-left">Nhân viên</th>
                      <th className="p-3 text-left">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map((job) => (
                      <tr key={job.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-3">{job.car}</td>
                        <td className="p-3">{job.service}</td>
                        <td className="p-3">{job.staff || "Chưa phân công"}</td>
                        <td
                          className={`p-3 font-semibold ${
                            job.status === "Hoàn tất"
                              ? "text-emerald-600"
                              : job.status === "Đang thực hiện"
                              ? "text-blue-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {job.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// 🔹 Stat Card
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

// 🔹 Chart Card
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
