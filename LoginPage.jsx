import React, { useState } from 'react';
import { Car, Shield, Zap, ArrowRight, Eye, EyeOff, Mail, Phone, User, Lock } from 'lucide-react';
import GoogleIcon from './GoogleIcon.jsx';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'phone'
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    centerName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your authentication logic here
  };

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    // Add Google OAuth logic here
  };

  const switchLoginMethod = (method) => {
    setLoginMethod(method);
    setFormData({
      ...formData,
      email: '',
      phone: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
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
                <p className="text-sm text-gray-600">Theo dõi bảo dưỡng xe điện một cách chuyên nghiệp</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bảo mật cao</h3>
                <p className="text-sm text-gray-600">Dữ liệu được bảo vệ với công nghệ tiên tiến</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">EV Care Pro</h1>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản mới để bắt đầu'}
              </p>
            </div>

            {/* Toggle Login/Register */}
            <div className="flex rounded-2xl bg-gray-100 p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isLogin 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors duration-200 mb-4 group"
            >
              <GoogleIcon />
              <span className="font-medium text-gray-700">
                {isLogin ? 'Đăng nhập' : 'Đăng ký'} với Google
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">hoặc</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Login Method Toggle */}
            {isLogin && (
              <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                <button
                  onClick={() => switchLoginMethod('email')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    loginMethod === 'email'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => switchLoginMethod('phone')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    loginMethod === 'phone'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>SĐT</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration fields */}
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Họ và tên"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      required={!isLogin}
                    />
                  </div>
        
                </>
              )}

              {/* Email or Phone field */}
              {(loginMethod === 'email' || !isLogin) && (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Địa chỉ email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              )}

              {(loginMethod === 'phone' && isLogin) && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              )}

              {/* Password field */}
              {(loginMethod === 'email' || !isLogin) && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {/* Confirm Password for registration */}
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Forgot Password */}
              {isLogin && loginMethod === 'email' && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Terms for registration */}
            {!isLogin && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <button className="text-emerald-600 hover:underline">Điều khoản dịch vụ</button>
                {' '}và{' '}
                <button className="text-emerald-600 hover:underline">Chính sách bảo mật</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;