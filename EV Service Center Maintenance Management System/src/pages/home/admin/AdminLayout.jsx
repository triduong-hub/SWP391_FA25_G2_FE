import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart,
  Users,
  DollarSign,
  Car,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: xóa token / session nếu có
    navigate("/");
  };

  const menuItems = [
    { path: "home", label: "Trang chính", icon: <BarChart className="w-5 h-5 mr-2" /> },
    { path: "users", label: "Người dùng", icon: <Users className="w-5 h-5 mr-2" /> },
    { path: "revenue", label: "Doanh thu", icon: <DollarSign className="w-5 h-5 mr-2" /> },
    { path: "cars", label: "Xe điện", icon: <Car className="w-5 h-5 mr-2" /> },
    { path: "schedule", label: "Lịch bảo dưỡng", icon: <Calendar className="w-5 h-5 mr-2" /> },
    { path: "staff", label: "Nhân viên", icon: <Users className="w-5 h-5 mr-2" /> },
    { path: "technician", label: "Phân công bảo dưỡng", icon: <Calendar className="w-5 h-5 mr-2" /> },
    { path: "settings", label: "Cài đặt", icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-white/20 shadow-xl p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-8 bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
          EV Service Admin
        </h2>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/admin/${item.path}`}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md font-semibold"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:bg-red-100 p-2 rounded-lg w-full transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
