import React, { useState } from 'react';
import { Car, Wrench, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import API from '../../../api';

const InputField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

const BookingConfirmation = ({ bookingData, setBookingData, onBack, onNext }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const getTotalPrice = () =>
    bookingData.services.reduce((total, service) => total + service.price, 0);

  const formatDateTime = (datetime) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(datetime));

  const isValidBooking = () => {
    const { vehicle, services, datetime, location, customerInfo } = bookingData;
    return (
      vehicle &&
      services.length > 0 &&
      datetime &&
      location &&
      customerInfo.name &&
      customerInfo.phone
    );
  };

  const handleNext = async () => {
    const { vehicle, services, datetime, location, customerInfo } = bookingData;

    if (!vehicle || !services?.length || !datetime || !location || !customerInfo?.id) {
      alert("Vui lòng nhập đầy đủ thông tin đặt lịch!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dateObj = new Date(datetime);
      const appointmentDate = dateObj.toLocaleDateString('en-CA');
      const appointmentTime = dateObj.toTimeString().slice(0, 5);

      const payload = {
        customerId: customerInfo.id,
        vehicleId: vehicle.id,
        serviceCenterId: location.id,
        serviceIds: services.map(s => s.id || s.serviceID),
        appointmentDate,
        appointmentTime,
        paymentMethod: bookingData.paymentMethod || 'cash',
        notes: bookingData.notes || 'Booking from web app',
      };

      console.group('📤 Payload gửi đến server:');
      console.table(payload);
      console.groupEnd();

      const res = await API.post('/bookings', payload);
      if (res.status === 200 || res.status === 201) {
        setSuccess(true); //  hiển thị trang thành công
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Sau 2.5s tự động gọi onNext (nếu có)
      }
    } catch (err) {
      console.error(' Lỗi khi gửi booking:', err);
      setError(err.response?.data?.message || err.message || 'Không thể gửi booking');
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-emerald-500 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-3xl font-bold text-gray-900">
          {language === 'vi' ? 'Đặt lịch thành công!' : 'Booking Successful!'}
        </h2>
        <p className="text-gray-600 max-w-md">
          {language === 'vi'
            ? 'Cảm ơn bạn đã đặt lịch bảo dưỡng. Chúng tôi sẽ sớm liên hệ xác nhận.'
            : 'Thank you for booking! We will contact you soon.'}
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Xem lại & xác nhận' : 'Review & Confirm'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi'
            ? 'Kiểm tra lại thông tin đặt lịch của bạn'
            : 'Review your booking information'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
        {/* Vehicle Info */}
        {bookingData.vehicle && (
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Car className="w-6 h-6 mr-2 text-emerald-600" />
              {language === 'vi' ? 'Thông tin xe' : 'Vehicle Information'}
            </h3>
            <div className="flex items-center space-x-4">
              <img
                src={bookingData.vehicle.image}
                alt={`${bookingData.vehicle.brand} ${bookingData.vehicle.model}`}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div>
                <h4 className="font-bold text-gray-900">
                  {bookingData.vehicle.brand} {bookingData.vehicle.model}
                </h4>
                <p className="text-gray-600">
                  {language === 'vi' ? 'Năm' : 'Year'}: {bookingData.vehicle.year}
                </p>
                <p className="text-gray-600">
                  {language === 'vi' ? 'Biển số' : 'License'}:{' '}
                  {bookingData.vehicle.licensePlate}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Wrench className="w-6 h-6 mr-2 text-emerald-600" />
            {language === 'vi' ? 'Dịch vụ đã chọn' : 'Selected Services'}
          </h3>
          <div className="space-y-3">
            {bookingData.services.map((service) => (
              <div
                key={service.serviceID || service.id}
                className="flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">
                    {service.duration}{' '}
                    {language === 'vi' ? 'phút' : 'minutes'}
                  </p>
                </div>
                <span className="font-bold text-emerald-600">
                  {formatPrice(service.price)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                <span className="text-emerald-600">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date, Time & Location */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-emerald-600" />
            {language === 'vi'
              ? 'Thời gian & địa điểm'
              : 'Time & Location'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'vi' ? 'Ngày giờ' : 'Date & Time'}
              </p>
              <p className="font-medium text-gray-900">
                {formatDateTime(bookingData.datetime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {language === 'vi' ? 'Địa điểm' : 'Location'}
              </p>
              <p className="font-medium text-gray-900">
                {bookingData.location?.name}
              </p>
              <p className="text-sm text-gray-600">
                {bookingData.location?.address}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-6 h-6 mr-2 text-emerald-600" />
            {language === 'vi'
              ? 'Thông tin liên hệ'
              : 'Contact Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={language === 'vi' ? 'Họ và tên' : 'Full Name'}
              value={bookingData.customerInfo.name}
              placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter full name'}
              onChange={(e) =>
                setBookingData({
                  ...bookingData,
                  customerInfo: {
                    ...bookingData.customerInfo,
                    name: e.target.value,
                  },
                })
              }
            />
            <InputField
              label={language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
              value={bookingData.customerInfo.phone}
              placeholder={language === 'vi' ? 'Nhập số điện thoại' : 'Enter phone number'}
              onChange={(e) =>
                setBookingData({
                  ...bookingData,
                  customerInfo: {
                    ...bookingData.customerInfo,
                    phone: e.target.value,
                  },
                })
              }
              type="tel"
            />
            <div className="md:col-span-2">
              <InputField
                label="Email"
                value={bookingData.customerInfo.email}
                placeholder={language === 'vi' ? 'Nhập địa chỉ email' : 'Enter email address'}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    customerInfo: {
                      ...bookingData.customerInfo,
                      email: e.target.value,
                    },
                  })
                }
                type="email"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!isValidBooking() || loading}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {loading
              ? language === 'vi'
                ? 'Đang xử lý...'
                : 'Processing...'
              : language === 'vi'
                ? 'Hoàn tất đặt lịch'
                : 'Complete Booking'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
