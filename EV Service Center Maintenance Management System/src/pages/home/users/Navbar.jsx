// src/pages/home/users/Navbar.jsx
import React, { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Đọc user từ localStorage
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // ✅ Khi có sự kiện userChanged
    const handleUserChanged = (e) => {
      if (e.detail) {
        setUser(e.detail);
      } else {
        loadUserFromStorage();
      }
    };

    // ✅ Lần đầu vào trang
    loadUserFromStorage();

    // ✅ Lắng nghe event
    window.addEventListener("userChanged", handleUserChanged);

    // ✅ Cleanup
    return () => window.removeEventListener("userChanged", handleUserChanged);
  }, []);

  // ✅ Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new CustomEvent("userChanged", { detail: null }));
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold cursor-pointer hover:text-emerald-400 transition"
        >
          EV Care Pro
        </h1>

        <nav className="flex items-center space-x-6">
          <a href="#services" className="hover:text-emerald-400 transition">
            Dịch vụ
          </a>
          <a href="#pricing" className="hover:text-emerald-400 transition">
            Bảng giá
          </a>
          <a href="#contact" className="hover:text-emerald-400 transition">
            Liên hệ
          </a>

          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 hover:text-emerald-400 transition">
                {user.avatarUrl || user.image ? (
                  <img
                    src={user.avatarUrl || user.image}
                    alt="avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span>{user.name || user.fullName || user.username || user.email || "Người dùng"}</span>
              </button>

              <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg hidden group-hover:block min-w-[160px]">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition"
            >
              Đăng nhập
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
