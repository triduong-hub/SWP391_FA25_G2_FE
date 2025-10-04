import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users, DollarSign, BarChart, Bell, Car } from "lucide-react";

const HomeAdmin = () => {
  const navigate = useNavigate();

  // Dashboard + Notifications
  const [stats, setStats] = useState({ users: 0, revenue: 0, vehicles: 0 });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef();

  // GỌI API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/admin/dashboard");

        const data = res.data;
        setStats({
          users: data.users ?? 0,
          revenue: data.revenue ?? 0,
          vehicles: data.vehicles ?? 0,
        });
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error(" Lỗi khi load dữ liệu:", error);
        // Dữ liệu demo fallback
        setStats({ users: 1234, revenue: 15600, vehicles: 20 });
        setNotifications([
          " Có 3 xe mới cần bảo dưỡng",
          "Người dùng mới đăng ký: Trần Văn C",
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Click ngoài ẩn notif
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col z-10">
        {/* Topbar */}
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

            <div
              className="w-9 h-9 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full cursor-pointer shadow-md"
              title="Profile"
            />
          </div>
        </header>

        {/* Dashboard */}
        <main className="p-6 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <p className="text-gray-500">⏳ Đang tải dữ liệu...</p>
          ) : (
            <>
              {/* Cards thống kê */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Người dùng"
                  value={stats.users}
                  color="from-blue-400 to-blue-600"
                  icon={<Users className="w-8 h-8 text-white" />}
                />
                <StatCard
                  title="Doanh thu"
                  value={`${stats.revenue}$`}
                  color="from-emerald-400 to-emerald-600"
                  icon={<DollarSign className="w-8 h-8 text-white" />}
                />
                <StatCard
                  title="Xe đang bảo dưỡng"
                  value={stats.vehicles}
                  color="from-yellow-400 to-yellow-600"
                  icon={<Car className="w-8 h-8 text-white" />}
                />
                <StatCard
                  title="Thông báo"
                  value={notifications.length}
                  color="from-red-400 to-red-600"
                  icon={<Bell className="w-8 h-8 text-white" />}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title=" Biểu đồ doanh thu hàng tháng" />
                <ChartCard title=" Biểu đồ bảo dưỡng xe" />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// StatCard
const StatCard = ({ title, value, icon, color }) => (
  <div className="p-6 rounded-3xl shadow-xl bg-white/80 backdrop-blur flex items-center justify-between hover:scale-105 transition-transform">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    <div
      className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-md flex items-center justify-center`}
    >
      {icon}
    </div>
  </div>
);

// ChartCard
const ChartCard = ({ title }) => (
  <div className="p-6 rounded-3xl shadow-xl bg-white/80 backdrop-blur h-64 flex items-center justify-center text-gray-700 font-semibold hover:shadow-2xl transition-shadow">
    {title}
  </div>
);

export default HomeAdmin;
