import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import API from '../../../api'; // API base đã setup

const PaymentForm = ({ bookingData, setBookingData, onBack, onComplete }) => {
  const { language } = useLanguage();

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getTotalPrice = () => bookingData.services.reduce((t, s) => t + (s.price || 0), 0);

  const handleComplete = async () => {
    try {
      if (!bookingData.vehicle?.id || !bookingData.services.length || !bookingData.location?.id || !bookingData.customerInfo?.name || !bookingData.customerInfo?.phone) {
        console.error(' Missing required booking info:', bookingData);
        alert('Thông tin đặt lịch chưa đầy đủ!');
        return;
      }

      const payload = {
  customerId: Number(JSON.parse(localStorage.getItem('user'))?.userID || 0),
  vehicleId: Number(bookingData.vehicle?.id),
  services: bookingData.services.map(s => Number(s.serviceID || s.id)),
  bookingDateTime: new Date(bookingData.datetime).toISOString(),
  locationId: Number(bookingData.location?.id),
  totalPrice: getTotalPrice(),
  customerName: bookingData.customerInfo?.name || '',
  customerPhone: bookingData.customerInfo?.phone || '',
  customerEmail: bookingData.customerInfo?.email || '',
  paymentMethod: 'cash',
};

      console.log(' Payload gửi lên API:', payload);

      const response = await API.post('/bookings', payload);
      console.log(' Booking saved:', response.data);
      onComplete();
    } catch (error) {
      console.error(' Lỗi lưu booking:', error);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Thanh toán' : 'Payment'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi'
            ? 'Phương thức thanh toán đã được chọn: Thanh toán tại trung tâm'
            : 'Payment method: Pay at Service Center'}
        </p>
      </div>

      {/* Payment summary */}
      <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Tóm tắt thanh toán' : 'Payment Summary'}
          </h3>
          <div className="space-y-2">
            {bookingData.services.map((service) => (
              <div key={service.id || service.serviceID} className="flex justify-between">
                <span className="text-gray-700">{service.name}</span>
                <span className="font-medium">{formatPrice(service.price || 0)}</span>
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
      </div>

      {/* Buttons */}
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
          <span>{language === 'vi' ? 'Hoàn tất đặt lịch' : 'Complete Booking'}</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
