import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  BarChart3,
  Bell,
  Car,
  ClipboardCheck,
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
import API from "../../../../api";

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [admin, setAdmin] = useState(null);

  const profileRef = useRef();

  // ✅ Load Admin info
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Use the actual admin ID from login response
    const adminId =
      storedUser?.refId ||
      storedUser?.refid ||
      storedUser?.id ||
      storedUser?.adminId ||
      localStorage.getItem("adminId");

    if (!adminId || !token) {
      console.error("❌ Không tìm thấy ID admin. Vui lòng đăng nhập lại.");
      return;
    }

    const fetchAdmin = async () => {
      try {
        const res = await API.get(`/admin/getby/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Admin info:", res.data);
        setAdmin(res.data.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin Admin:", error);
      }
    };

    fetchAdmin();
  }, []);

  // ✅ Load dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardRes = await API.get("/admin/dashboard");
        const data = dashboardRes.data;
        setStats({
          users: data.users ?? 0,
          revenue: data.revenue ?? 0,
          vehicles: data.vehicles ?? 0,
          pendingAssignments: data.pendingAssignments ?? 0,
        });
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Mock chart data
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
        {/* Header */}
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-white/30 p-4 shadow-md">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Trang quản trị
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile dropdown */}
            <div ref={profileRef} className="relative">
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 cursor-pointer bg-white/80 px-3 py-1.5 rounded-full shadow hover:bg-white transition"
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
                    onClick={() => navigate("/admin/profile")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 transition"
                  >
                    Hồ sơ
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
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

        {/* Main section */}
        <main className="p-6 flex-1 overflow-y-auto space-y-6 mt-20">
          {loading ? (
            <p className="text-gray-500">⏳ Đang tải dữ liệu...</p>
          ) : (
            <>
              {/* Dashboard cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Người dùng"
                  value={stats.users}
                  icon={<Users />}
                  color="from-blue-400 to-blue-600"
                />
                <StatCard
                  title="Doanh thu"
                  value={`${stats.revenue}$`}
                  icon={<DollarSign />}
                  color="from-emerald-400 to-emerald-600"
                />
                <StatCard
                  title="Xe đang bảo dưỡng"
                  value={stats.vehicles}
                  icon={<Car />}
                  color="from-yellow-400 to-yellow-600"
                />
                <StatCard
                  title="Công việc chờ"
                  value={stats.pendingAssignments}
                  icon={<ClipboardCheck />}
                  color="from-indigo-400 to-indigo-600"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ChartCard
                  title="Doanh thu hàng tháng"
                  data={revenueData}
                  dataKey="revenue"
                  color="#10b981"
                />
                <ChartCard
                  title="Số xe bảo dưỡng theo tháng"
                  data={maintenanceData}
                  dataKey="jobs"
                  color="#f59e0b"
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="p-6 rounded-3xl shadow-xl bg-white/80 backdrop-blur flex items-center justify-between hover:scale-105 transition-transform cursor-pointer">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-md text-white`}>
      {icon}
    </div>
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
