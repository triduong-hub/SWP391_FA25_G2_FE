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
  // 🧩 Biểu đồ thống kê checklist fail
  const [failureData, setFailureData] = useState([]);
  // 👥 Biểu đồ thống kê account theo role
  const [accountStats, setAccountStats] = useState([]);
  // 📦 Biểu đồ đơn hàng & bảo dưỡng theo tháng
  const [orderStats, setOrderStats] = useState([]);
  const [technicianPerformance, setTechnicianPerformance] = useState([]);
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

  useEffect(() => {
    const fetchFailureData = async () => {
      try {
        const res = await API.get("/statistics/failures");
        console.log("⚠️ Dữ liệu lỗi checklist:", res.data);
        setFailureData(res.data.failure_statistics || []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu lỗi checklist:", error);
      }
    };
    fetchFailureData();
  }, []);

  useEffect(() => {
    const fetchAccountStats = async () => {
      try {
        const res = await API.get("/statistics/accounts");
        console.log("👥 Dữ liệu tài khoản theo role:", res.data);
        setAccountStats(res.data.statistics || []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu tài khoản:", error);
      }
    };
    fetchAccountStats();
  }, []);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const year = new Date().getFullYear(); // Lấy năm hiện tại
        const res = await API.get(`/statistics/orders/monthly?year=${year}`);
        console.log("📦 Dữ liệu đơn hàng theo tháng:", res.data);

        // Chuyển đổi dạng object sang mảng để Recharts dễ đọc
        const months = Object.keys(res.data.ordersByMonth || {});
        const formattedData = months.map((m) => ({
          month: `Tháng ${m}`,
          orders: res.data.ordersByMonth[m] || 0,
          maintenances: res.data.maintenanceByMonth[m] || 0,
        }));

        setOrderStats(formattedData);
      } catch (error) {
        console.error("❌ Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };
    fetchOrderStats();
  }, []);

  useEffect(() => {
    const fetchTechnicianPerformance = async () => {
      try {
        const res = await API.get("/statistics/technician-performance/all-months");
        console.log("🔧 Hiệu suất kỹ thuật viên:", res.data);

        const reports = res.data.monthlyReports || [];

        // Format từng technician theo từng tháng
        const formatted = reports.flatMap((report) =>
          report.allTechnicians.map((tech) => ({
            month: `${report.month}/${report.year}`,
            technician: tech.employeeName,
            count: tech.maintenanceCount
          }))
        );

        setTechnicianPerformance(formatted);
      } catch (error) {
        console.error("❌ Lỗi khi lấy hiệu suất kỹ thuật viên:", error);
      }
    };

    fetchTechnicianPerformance();
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
                    <Bar dataKey="revenue" name="Doanh thu" fill="#4A90E2" />
                    <Bar dataKey="expense" name="Chi phí" fill="#A0AEC0" />
                    <Bar dataKey="profit" name="Lợi nhuận" fill="#2D9C68" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ✅ Biểu đồ checklist fail */}
            <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thống kê checklist bị lỗi & xu hướng hỏng hóc
              </h3>

              {!failureData.length ? (
                <p className="text-gray-500">Đang tải biểu đồ...</p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={failureData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="checklist_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fail_count" name="Số lần lỗi" fill="#F56565" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* ✅ Biểu đồ tài khoản theo vai trò */}
            <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thống kê số lượng tài khoản theo vai trò và tháng
              </h3>

              {!accountStats.length ? (
                <p className="text-gray-500">Đang tải biểu đồ...</p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={accountStats}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="CUSTOMER" name="Khách hàng" fill="#4A90E2" />
                    <Bar dataKey="STAFF" name="Nhân viên" fill="#A0AEC0" />
                    <Bar dataKey="TECHNICIAN" name="Kỹ thuật viên" fill="#2D9C68" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {/* ✅ Biểu đồ đơn hàng & bảo dưỡng theo tháng */}
            <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thống kê số lượng đơn hàng & bảo dưỡng theo tháng ({new Date().getFullYear()})
              </h3>

              {!orderStats.length ? (
                <p className="text-gray-500">Đang tải biểu đồ...</p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={orderStats}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" name="Đơn hàng" fill="#4A90E2" />
                    <Bar dataKey="maintenances" name="Bảo dưỡng" fill="#A0AEC0" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            {/* ✅ Biểu đồ hiệu suất kỹ thuật viên */}
            <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Hiệu suất kỹ thuật viên theo tháng
              </h3>

              {!technicianPerformance.length ? (
                <p className="text-gray-500">Đang tải biểu đồ...</p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={technicianPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Số bảo dưỡng" fill="#4A90E2" />
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
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm 
                    hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">

        {/* Text */}
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>

        {/* Icon */}
        <div className="p-3 rounded-xl bg-gray-100 text-gray-600">
          {Icon}
        </div>
      </div>
    </div>
  );
};




export default HomeAdmin;
