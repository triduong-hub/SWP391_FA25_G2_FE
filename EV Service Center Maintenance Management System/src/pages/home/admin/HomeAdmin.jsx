import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCog, Wrench, Car, ClipboardList, Activity } from "lucide-react";
import API from "../../../../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
const HomeAdmin = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [revenueData, setRevenueData] = useState([]);
  const profileRef = useRef();

  // ✅ Lấy dữ liệu dashboard từ API
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/statistics/dashboard");
        console.log("📊 Dữ liệu dashboard nhận được:", res.data);
        setDashboard(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const res = await API.get("/statistics/revenue");
        console.log("💰 Dữ liệu doanh thu:", res.data);
        setRevenueData(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu doanh thu:", error);
      }
    };
    fetchRevenueData();
  }, []);


  // ✅ Click ra ngoài đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-white border border-gray-100 rounded-3xl m-4 px-6 py-3 shadow-sm">
        <div className="text-xl font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
          Trang quản trị
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-400"
          />

          {/* 👤 Admin */}
          <div ref={profileRef} className="relative cursor-pointer">
            <div
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                {admin ? admin.name?.charAt(0)?.toUpperCase() : "A"}
              </div>
              <span className="text-gray-700 text-sm font-medium">
                {admin ? admin.name : "Admin"}
              </span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 transition"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Thống kê tổng quan
        </h2>

        {!dashboard ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : (
          <>
            {/* ✅ Khối thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <StatCard
                title="Khách hàng"
                value={dashboard.totalCustomers}
                color="emerald"
                icon={<Users className="w-6 h-6" />}
              />
              <StatCard
                title="Nhân viên"
                value={dashboard.totalStaff}
                color="blue"
                icon={<UserCog className="w-6 h-6" />}
              />
              <StatCard
                title="Kỹ thuật viên"
                value={dashboard.totalTechnicians}
                color="orange"
                icon={<Wrench className="w-6 h-6" />}
              />
              <StatCard
                title="Người dùng hoạt động"
                value={dashboard.totalActiveUsers}
                color="purple"
                icon={<Activity className="w-6 h-6" />}
              />
              <StatCard
                title="Xe hoạt động"
                value={dashboard.totalActiveVehicles}
                color="indigo"
                icon={<Car className="w-6 h-6" />}
              />
              <StatCard
                title="Đơn hàng"
                value={dashboard.totalOrders}
                color="rose"
                icon={<ClipboardList className="w-6 h-6" />}
              />
              <StatCard
                title="Bảo dưỡng"
                value={dashboard.totalMaintenances}
                color="emerald"
                icon={<Wrench className="w-6 h-6" />}
              />
            </div>

            {/* ✅ Biểu đồ doanh thu */}
            <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Biểu đồ doanh thu - chi phí - lợi nhuận theo tháng
              </h3>

              {!revenueData.length ? (
                <p className="text-gray-500">Đang tải biểu đồ...</p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Doanh thu" fill="#10b981" />
                    <Bar dataKey="expense" name="Chi phí" fill="#3b82f6" />
                    <Bar dataKey="profit" name="Lợi nhuận" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </main>

    </div>
  );
};

// ✅ Component nhỏ để hiển thị thẻ thống kê (phiên bản đẹp hơn)
// ✅ StatCard phiên bản chuyên nghiệp
const StatCard = ({ title, value, icon, color }) => {
  // Màu theme động
  const colors = {
    emerald: "from-emerald-500 to-green-400",
    blue: "from-blue-500 to-cyan-400",
    orange: "from-orange-500 to-amber-400",
    purple: "from-purple-500 to-pink-400",
    indigo: "from-indigo-500 to-sky-400",
    rose: "from-rose-500 to-red-400",
    gray: "from-gray-500 to-gray-400",
  };

  return (
    <div className="relative group">
      {/* Card chính */}
      <div className="p-6 rounded-2xl bg-white shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        {/* Nền hiệu ứng gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${colors[color]} opacity-0 group-hover:opacity-10 transition duration-500 rounded-2xl`}
        ></div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">
              {value}
            </h3>
          </div>
          <div
            className={`p-3 rounded-2xl bg-gradient-to-br ${colors[color]} text-white shadow-lg transform group-hover:scale-110 transition-transform`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};



export default HomeAdmin;
