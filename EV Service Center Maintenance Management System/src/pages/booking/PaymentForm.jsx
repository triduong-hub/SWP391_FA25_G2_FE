import React from 'react';
import { CheckCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PaymentForm = ({ bookingData, setBookingData, onBack, onComplete }) => {
  const { language } = useLanguage();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalPrice = () => {
    return bookingData.services.reduce((total, service) => total + service.price, 0);
  };

  const handleComplete = () => {
    // Simulate payment processing
    alert(language === 'vi' 
      ? 'Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận.'
      : 'Booking successful! We will contact you for confirmation.'
    );
    onComplete();
  };

  const paymentMethods = [
    { 
      id: 'cash', 
      name: language === 'vi' ? 'Thanh toán tại trung tâm' : 'Pay at Service Center',
      icon: '💵',
      description: language === 'vi' ? 'Thanh toán bằng tiền mặt khi đến trung tâm' : 'Pay with cash when you arrive'
    },
    { 
      id: 'card', 
      name: language === 'vi' ? 'Thẻ tín dụng/ghi nợ' : 'Credit/Debit Card',
      icon: '💳',
      description: language === 'vi' ? 'Thanh toán online bằng thẻ' : 'Pay online with card'
    },
    { 
      id: 'bank', 
      name: language === 'vi' ? 'Chuyển khoản ngân hàng' : 'Bank Transfer',
      icon: '🏦',
      description: language === 'vi' ? 'Chuyển khoản qua ngân hàng' : 'Transfer via bank'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Thanh toán' : 'Payment'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi' 
            ? 'Chọn phương thức thanh toán để hoàn tất đặt lịch'
            : 'Choose payment method to complete your booking'
          }
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
        {/* Payment Summary */}
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Tóm tắt thanh toán' : 'Payment Summary'}
          </h3>
          <div className="space-y-2">
            {bookingData.services.map((service) => (
              <div key={service.id} className="flex justify-between">
                <span className="text-gray-700">{service.name}</span>
                <span className="font-medium">{formatPrice(service.price)}</span>
              </div>
            ))}
            <div className="border-t border-emerald-200 pt-2 mt-2">
              <div className="flex justify-between font-bold text-xl">
                <span>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                <span className="text-emerald-600">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Phương thức thanh toán' : 'Payment Method'}
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setBookingData({ ...bookingData, paymentMethod: method.id })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  bookingData.paymentMethod === method.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {bookingData.paymentMethod === method.id && (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Payment Form */}
        {bookingData.paymentMethod === 'card' && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">
              {language === 'vi' ? 'Thông tin thẻ' : 'Card Information'}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'vi' ? 'Số thẻ' : 'Card Number'}
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'vi' ? 'Ngày hết hạn' : 'Expiry Date'}
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-5 h-5" />
          <span>{language === 'vi' ? 'Hoàn tất thanh toán' : 'Complete Payment'}</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;