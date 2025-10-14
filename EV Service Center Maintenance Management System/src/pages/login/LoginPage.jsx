import React, { useState } from "react";
import {
  Car,
  Shield,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleIcon from "./GoogleIcon.jsx";

const LoginForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        phone: formData.phone,
        password: formData.password,
      });

      const data = response.data;
      console.log(" Login response:", data);

      if (!data.token) {
        setMessage({ text: " Sai số điện thoại hoặc mật khẩu!", type: "error" });
        return;
      }


      //  Lưu token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      //  Phân loại theo role
      if (data.role?.toLowerCase() === "admin") {
        console.log(" Admin đăng nhập");
        navigate("/admin/home");
      } else if (data.role?.toLowerCase() === "customer") {
        console.log(" Customer đăng nhập");

        // Lấy customerId chính xác từ backend
        const customerId =
          data.refid || data.id || data.customerId || data.user?.id;

        if (customerId) {
          localStorage.setItem("customerId", customerId);
          console.log(" Saved customerId:", customerId);
        } else {
          console.warn(" Không tìm thấy customerId:", data);
        }

        navigate("/");
        window.location.reload();
      } else {
        console.warn(" Vai trò không xác định:", data.role);
        alert("Không xác định được loại tài khoản!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setMessage({
        text: err.response?.data?.message || "❌ Sai số điện thoại hoặc mật khẩu!",
        type: "error",
      });
    }

  };


  return (
    <>
      <button
        onClick={() => console.log("Google login initiated")}
        className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl mb-4"
      >
        <GoogleIcon />
        <span className="font-medium text-gray-700">Tiếp tục với Google</span>
      </button>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500 bg-white">hoặc</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {message.text && (
          <div
            className={`text-center font-semibold ${message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
          >
            {message.text}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
        >
          <span>Đăng nhập</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-6">
        Chưa có tài khoản?{" "}
        <button onClick={onSwitch} className="text-emerald-600 hover:underline">
          Đăng ký ngay
        </button>
      </p>
    </>
  );
};

// --- RegisterForm giữ nguyên (chỉ sửa nhỏ nếu cần) ---
const RegisterForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const body = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      const response = await axios.post("http://localhost:8080/api/customer/register", body);

      if (response.status === 201 || response.status === 200) {
        const data = response.data;
        setMessage({ text: "🎉 Đăng ký thành công! Đang đăng nhập...", type: "success" });

        // Nếu backend trả token
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));

          const customerId =
            data.refid || data.id || data.customerId || data.user?.id;
          if (customerId) localStorage.setItem("customerId", customerId);

          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 1500);
          return;
        }

        // Nếu chưa có token → tự login lại
        const loginResponse = await axios.post("http://localhost:8080/api/auth/login", {
          phone: formData.phone,
          password: formData.password,
        });

        const loginData = loginResponse.data;
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(loginData));

        const customerId =
          loginData.refid || loginData.id || loginData.customerId || loginData.user?.id;
        if (customerId) localStorage.setItem("customerId", customerId);

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
      } else {
        setMessage({ text: "❌ Đăng ký thất bại. Vui lòng thử lại!", type: "error" });
      }

    } catch (err) {
      console.error("Lỗi đăng ký:", err);

      // Kiểm tra nếu backend trả lỗi trùng số điện thoại
      const errorMessage = err.response?.data?.message || "";
      if (
        errorMessage.toLowerCase().includes("phone") ||
        errorMessage.toLowerCase().includes("exists") ||
        errorMessage.toLowerCase().includes("duplicate")
      ) {
        setMessage({ text: "⚠️ Số điện thoại đã được sử dụng!", type: "error" });
      } else {
        setMessage({
          text: "❌ Đăng ký thất bại! Vui lòng thử lại.",
          type: "error",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          name="fullName"
          placeholder="Họ và tên"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>
      {message.text && (
        <div
          className={`text-center font-semibold ${message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
        >
          {message.text}
        </div>
      )}
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg"
      >
        <span>Tạo tài khoản</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <p className="text-sm text-gray-600 text-center mt-6">
        Đã có tài khoản?{" "}
        <button onClick={onSwitch} className="text-emerald-600 hover:underline">
          Đăng nhập
        </button>
      </p>
    </form>
  );
};

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-2xl shadow-lg">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">EV Care Pro</h1>
              <p className="text-sm text-gray-600">Bảo dưỡng xe điện</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quản lý hiệu quả</h3>
                <p className="text-sm text-gray-600">
                  Theo dõi bảo dưỡng xe điện một cách chuyên nghiệp
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bảo mật cao</h3>
                <p className="text-sm text-gray-600">
                  Dữ liệu được bảo vệ với công nghệ tiên tiến
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">EV Care Pro</h1>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </h2>
              <p className="text-gray-600">
                {isLogin ? "Chào mừng bạn quay trở lại!" : "Tạo tài khoản mới để bắt đầu"}
              </p>
            </div>

            {isLogin ? (
              <LoginForm onSwitch={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitch={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
