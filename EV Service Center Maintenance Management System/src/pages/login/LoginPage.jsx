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
import GoogleIcon from "./GoogleIcon.jsx";
import useFetch from "../../hook/useFetch.jsx";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState("email"); // email | phone
  const [showPassword, setShowPassword] = useState(false);
  const { post } = useFetch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", {
      mode: isLogin ? "login" : "register",
      ...formData,
    });

    try {
      // Xác định URL và body tùy theo chế độ login / register
      const url = isLogin
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/customer/register";

      const body = isLogin
        ? {
          phone: formData.phone,
          password: formData.password,
        }
        : {
          name: formData.fullName,   // ✅ Đổi fullName -> name
          email: formData.email,
          phone: formData.phone,     // ✅ Thêm phone
          password: formData.password,
        };

      console.log("Body gửi lên:", body);

      // Gọi API bằng hook useFetch
      const response = await post(body, {}, url);

      console.log("API response:", response);

      if (isLogin) {
        // alert("Đăng nhập thành công!");
        // Lưu token và thông tin user nếu backend trả về
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        localStorage.setItem("user", JSON.stringify(response));
      } else {
        // alert("Đăng ký thành công! Vui lòng đăng nhập.");
        // Sau khi đăng ký, chuyển sang chế độ login
        setIsLogin(true);
      }
      navigate("/");
    } catch (err) {
      console.error("Error during submit:", err);
      alert(err.messageFromServer || "Đã xảy ra lỗi. Vui lòng thử lại!");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login initiated");
    // TODO: xử lý Google OAuth
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Nền trang trí */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Bên trái - Thương hiệu */}
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

        {/* Bên phải - Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Tiêu đề */}
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
                {isLogin
                  ? "Chào mừng bạn quay trở lại!"
                  : "Tạo tài khoản mới để bắt đầu"}
              </p>
            </div>

            {/* Toggle Đăng nhập / Đăng ký */}
            <div className="flex rounded-2xl bg-gray-100 p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${isLogin
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${!isLogin
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Nút Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200 mb-4 group"
            >
              <GoogleIcon />
              <span className="font-medium text-gray-700">
                Tiếp tục với Google
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">hoặc</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ tên (chỉ khi đăng ký) */}
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              )}

              {/* Nếu là Đăng nhập → chọn Email / SĐT */}
              {isLogin ? (
                <>
                  <div className="flex rounded-xl bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => setLoginMethod("email")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${loginMethod === "email"
                        ? "bg-white shadow text-gray-800"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod("phone")}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${loginMethod === "phone"
                        ? "bg-white shadow text-gray-800"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                      SĐT
                    </button>
                  </div>

                  {loginMethod === "email" ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Địa chỉ email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Địa chỉ email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </>
              )}

              {/* Mật khẩu */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Xác nhận mật khẩu khi Đăng ký */}
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              )}

              {/* Ghi nhớ đăng nhập + Quên mật khẩu */}
              {isLogin && (
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe || false}
                      onChange={(e) =>
                        setFormData({ ...formData, rememberMe: e.target.checked })
                      }
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="ml-2">Ghi nhớ đăng nhập</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {/* Nút Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>{isLogin ? "Đăng nhập" : "Tạo tài khoản"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Điều khoản */}
            {!isLogin && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <button className="text-emerald-600 hover:underline">
                  Điều khoản dịch vụ
                </button>{" "}
                và{" "}
                <button className="text-emerald-600 hover:underline">
                  Chính sách bảo mật
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
