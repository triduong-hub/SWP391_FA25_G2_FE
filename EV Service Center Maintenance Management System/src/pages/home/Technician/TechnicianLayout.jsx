import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Wrench, LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";

const TechnicianLayout = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [techName, setTechName] = useState("Technician");
  const profileRef = useRef(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.name) {
        setTechName(user.name);
      }
    } catch (e) { /* handle error */ }
    
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { 
      path: "/technician/dashboard", 
      label: "Bảng điều khiển", 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      path: "/technician/components", 
      label: "Quản lý Phụ tùng", 
      icon: <Wrench className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar (Menu bên trái) */}
      <aside className="w-60 bg-white shadow-md flex flex-col flex-shrink-0">
        
        {/* Tiêu đề */}
        <div className="h-[69px] border-b flex items-center justify-center">
          <h2 className="text-xl font-bold text-green-600">Tech Panel</h2>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/technician/dashboard"} 
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-green-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`
              }
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

      </aside>

      {/* Khu vực nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER MỚI */}
        <header className="flex justify-between items-center bg-white border border-gray-100 rounded-3xl mx-6 mt-6 px-6 py-3 shadow-sm z-10">
          
          {/* Title */}
          <div className="text-xl font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Technician Dashboard
          </div>

          {/* Search & Profile */}
          <div className="flex items-center space-x-4">            
        
            {/* Profile Button */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(prev => !prev)}
                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {/* Lấy chữ cái đầu tiên của tên Technician */}
                  {techName?.charAt(0)?.toUpperCase() || "T"}
                </div>
                <span className="text-gray-700 text-sm font-medium">
                  {techName}
                </span>
              </button>
              
              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden border z-20">
                  <NavLink 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Xem Profile
                  </NavLink>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
};

export default TechnicianLayout;