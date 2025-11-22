import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart,
  Users,
  DollarSign,
  Car,
  Calendar,
  Settings,
  LogOut,
  Package, 
  ShoppingCart,  // Icon cho Kho linh kiện
  ClipboardList
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const role = storedUser.role?.toUpperCase().trim();

    // Nếu role hiện tại KHÔNG PHẢI LÀ ADMIN
    if (role !== "ADMIN") {
      console.warn(`Chặn truy cập Admin! User hiện tại là: ${role}`);

      // Đá về đúng trang của role đó
      if (role === "CUSTOMER") {
        navigate("/");
      } else if (role === "STAFF") {
        navigate("/staff/dashboard");
      } else if (role === "TECHNICIAN") {
        navigate("/technician/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);
  const handleLogout = () => {
    // Khi logout thì xóa sạch localStorage để tab khác cũng bị văng ra
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    localStorage.removeItem("customerId");
    localStorage.removeItem("employeeId"); 
    localStorage.removeItem("adminId");
    navigate("/login");
  };

  const menuItems = [
    { path: "home", label: "Trang chính", icon: <BarChart className="w-5 h-5 mr-2" /> },
    { path: "users", label: "Người dùng", icon: <Users className="w-5 h-5 mr-2" /> },
    { path: "revenue", label: "Doanh thu", icon: <DollarSign className="w-5 h-5 mr-2" /> },
    { path: "cars", label: "Xe điện", icon: <Car className="w-5 h-5 mr-2" /> },
    { path: "inventory", label: "Kho linh kiện", icon: <Package className="w-5 h-5 mr-2" /> },
    // { path: "services", label: "Dịch vụ", icon: <Wrench className="w-5 h-5 mr-2" /> },
    // { path: "quotations", label: "Báo giá", icon: <FileText className="w-5 h-5 mr-2" /> },
    { path: "orders", label: "Quản lý đơn hàng", icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
    { path: "models", label: "Mẫu xe", icon: <Car className="w-5 h-5 mr-2" /> },
    { path: "schedule", label: "Lịch bảo dưỡng", icon: <Calendar className="w-5 h-5 mr-2" /> },
    { path: "staff", label: "Nhân viên", icon: <Users className="w-5 h-5 mr-2" /> },
    { path: "services", label: "Dịch vụ", icon: <Settings className="w-5 h-5 mr-2" /> },
    { path: "technician", label: "Phân công kĩ thuật viên", icon: <ClipboardList className="w-5 h-5 mr-2" /> },
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
                `flex items-center p-2 rounded-lg transition-all duration-200 ${isActive
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
