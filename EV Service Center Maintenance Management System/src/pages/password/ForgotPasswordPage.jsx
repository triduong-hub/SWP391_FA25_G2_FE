import React, { useState } from 'react';
import { Car, ArrowLeft, Mail, Send, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api'; // ✅ thêm dòng này

const ForgotPasswordPage = () => {
  const [step, setStep] = useState('input');
  const [formData, setFormData] = useState({ email: '', code: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Gửi email đến API
  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', {
        email: formData.email
      });
      console.log('✅ Forgot password response:', res.data);
      setStep('success');
      setMessage(' Vui lòng kiểm tra email để đặt lại mật khẩu!');

    } catch (err) {
      console.error('❌ Forgot password error:', err);
      setMessage(err.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại!');
    }
  };

  // ⚙️ Xác nhận mã (hiện chỉ mô phỏng)
  const handleVerifyCode = (e) => {
    e.preventDefault();
    console.log('Verifying code:', formData.code);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
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
              {step === 'input' && 'Nhập email để nhận liên kết khôi phục mật khẩu'}
              {step === 'code' && `Mã xác nhận đã được gửi đến ${formData.email}`}
              {step === 'success' && 'Liên kết đặt lại mật khẩu đã được gửi'}
            </p>
          </div>

          {/* Nút quay lại */}
          {step !== 'success' && (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Quay lại đăng nhập</span>
            </button>
          )}

          {/* Step 1 - Nhập email */}
          {step === 'input' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {message && (
                <p className="text-sm text-center text-emerald-600 font-medium">{message}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Send className="w-5 h-5" />
                <span>Gửi mã xác nhận</span>
              </button>
            </form>
          )}

          {/* Step 2 - Nhập mã */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm text-emerald-700">
                  Mã xác nhận 6 chữ số đã được gửi đến{' '}
                  <span className="font-semibold">{formData.email}</span>
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
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 flex items-center justify-center space-x-2 shadow-lg"
              >
                <Shield className="w-5 h-5" />
                <span>Xác nhận mã</span>
              </button>
            </form>
          )}

          {/* Step 3 - Thành công */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Kiểm tra email của bạn
              </h3>
              <p className="text-gray-600 text-sm">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
                <span className="font-semibold">{formData.email}</span>
              </p>

              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 flex items-center justify-center space-x-2 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại đăng nhập</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
