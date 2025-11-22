import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardCheck,
    LogOut,
    User,
    ChevronDown,
    Users,
    ShoppingCart,
    Car
} from "lucide-react";

const StaffLayout = () => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [staffName, setStaffName] = useState("Staff");
    const profileRef = useRef(null);

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.name) {
                setStaffName(user.name);
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
        }
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const role = storedUser.role?.toUpperCase().trim();

        // Nếu không phải STAFF thì đá về đúng chỗ
        if (role !== "STAFF") {
            console.warn(`Chặn truy cập Staff! User hiện tại là: ${role}`);

            if (role === "ADMIN") navigate("/admin/home");
            else if (role === "TECHNICIAN") navigate("/technician/dashboard");
            else if (role === "CUSTOMER") navigate("/");
            else navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileRef]);

    const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    localStorage.removeItem("customerId");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("adminId");

    navigate("/login");
  };

    const menuItems = [
        {
            path: "/staff/dashboard",
            label: "Trang chủ",
            icon: <LayoutDashboard className="w-5 h-5" />
        },
        {
            path: "/staff/orders",
            label: "Quản lý đơn hàng",
            icon: <ShoppingCart className="w-5 h-5" />
        },
        {
            path: "/staff/vehicles",
            label: "Quản lý xe",
            icon: <Car className="w-5 h-5" />
        },
        {
            path: "/staff/assignments",
            label: "Xem Phân công",
            icon: <ClipboardCheck className="w-5 h-5" />
        },
        {
            path: "/staff/technicians",
            label: "Quản lý Kỹ thuật",
            icon: <Users className="w-5 h-5" />
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-60 bg-white shadow-md flex flex-col flex-shrink-0">
                <div className="h-[69px] border-b flex items-center justify-center">
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/staff/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive
                                    ? "bg-blue-500 text-white shadow-lg"
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

            {/* Nội dung chính */}
            <main className="flex-1 p-6 overflow-auto bg-gray-50">

                {/*Header*/}
                <header className="flex justify-between items-center bg-white border border-gray-100 rounded-3xl px-6 py-3 shadow-sm mb-6">

                    {/* Title */}
                    <div className="text-xl font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                        Staff Panel
                    </div>

                    {/* Search & Profile */}
                    <div className="flex items-center space-x-4">

                        {/* Search Bar
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            /> */}

                        {/* Profile Button */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setShowProfileMenu(prev => !prev)}
                                className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                                    {/* Lấy chữ cái đầu tiên của tên */}
                                    {staffName?.charAt(0)?.toUpperCase() || "S"}
                                </div>
                                <span className="text-gray-700 text-sm font-medium">
                                    {staffName}
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
                <Outlet />
            </main>

        </div>
    );
};

export default StaffLayout;