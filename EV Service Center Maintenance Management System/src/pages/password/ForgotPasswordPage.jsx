import React, { useState } from 'react';
import { Car, ArrowLeft, Mail, Phone, Send, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [resetMethod, setResetMethod] = useState('email');
  const [step, setStep] = useState('input');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    code: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    console.log('Sending reset code via:', resetMethod, formData);
    setStep('code');
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    console.log('Verifying code:', formData.code);
    setStep('success');
  };

  const switchResetMethod = (method) => {
    setResetMethod(method);
    setFormData({
      ...formData,
      email: '',
      phone: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">EV Care Pro</h1>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {step === 'input' && 'Quên mật khẩu'}
              {step === 'code' && 'Nhập mã xác nhận'}
              {step === 'success' && 'Thành công'}
            </h2>
            <p className="text-gray-600">
              {step === 'input' && 'Chọn phương thức để nhận mã khôi phục'}
              {step === 'code' && `Mã xác nhận đã được gửi đến ${resetMethod === 'email' ? 'email' : 'số điện thoại'} của bạn`}
              {step === 'success' && 'Liên kết đặt lại mật khẩu đã được gửi'}
            </p>
          </div>

          {/* Back button */}
          {step !== 'success' && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Quay lại đăng nhập</span>
            </button>
          )}

          {/* Step 1 */}
          {step === 'input' && (
            <>
              {/* Method Toggle */}
              <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                <button
                  onClick={() => switchResetMethod('email')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    resetMethod === 'email'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => switchResetMethod('phone')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    resetMethod === 'phone'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>SĐT</span>
                </button>
              </div>

              <form onSubmit={handleSendCode} className="space-y-6">
                {resetMethod === 'email' ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Nhập địa chỉ email của bạn"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Nhập số điện thoại của bạn"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  <span>Gửi mã xác nhận</span>
                </button>
              </form>
            </>
          )}

          {/* Step 2 */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-emerald-700">
                  Mã xác nhận 6 chữ số đã được gửi đến{' '}
                  <span className="font-semibold">
                    {resetMethod === 'email' ? formData.email : formData.phone}
                  </span>
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="code"
                  placeholder="Nhập mã xác nhận 6 chữ số"
                  value={formData.code}
                  onChange={handleInputChange}
                  maxLength="6"
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Shield className="w-5 h-5" />
                <span>Xác nhận mã</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Không nhận được mã? Gửi lại
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Kiểm tra {resetMethod === 'email' ? 'email' : 'tin nhắn'} của bạn
              </h3>
              <p className="text-gray-600 text-sm">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
                <span className="font-semibold">
                  {resetMethod === 'email' ? formData.email : formData.phone}
                </span>
              </p>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 flex items-center justify-center space-x-2 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại đăng nhập</span>
              </button>
            </div>
          )}

          {/* Help */}
          {step !== 'success' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                Nếu bạn gặp khó khăn, vui lòng liên hệ bộ phận hỗ trợ kỹ thuật để được trợ giúp 
              </p>
              <p className="text-xs text-blue-700 text-center">
                Hotline:0906791084
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
