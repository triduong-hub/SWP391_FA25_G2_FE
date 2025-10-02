import React from 'react';
import { Car, Wrench, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const BookingConfirmation = ({ bookingData, setBookingData, onBack, onNext }) => {
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

  const handleNext = () => {
    if (bookingData.customerInfo.name && bookingData.customerInfo.phone) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Xem lại & xác nhận' : 'Review & Confirm'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi' 
            ? 'Kiểm tra lại thông tin đặt lịch của bạn'
            : 'Review your booking information'
          }
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
                <p className="text-gray-600">{language === 'vi' ? 'Năm' : 'Year'}: {bookingData.vehicle.year}</p>
                <p className="text-gray-600">{language === 'vi' ? 'Biển số' : 'License'}: {bookingData.vehicle.licensePlate}</p>
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
              <div key={service.id} className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.duration} {language === 'vi' ? 'phút' : 'minutes'}</p>
                </div>
                <span className="font-bold text-emerald-600">{formatPrice(service.price)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                <span className="text-emerald-600">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date, Time & Location */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-emerald-600" />
            {language === 'vi' ? 'Thời gian & địa điểm' : 'Time & Location'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{language === 'vi' ? 'Ngày giờ' : 'Date & Time'}</p>
              <p className="font-medium text-gray-900">{bookingData.datetime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{language === 'vi' ? 'Địa điểm' : 'Location'}</p>
              <p className="font-medium text-gray-900">{bookingData.location?.name}</p>
              <p className="text-sm text-gray-600">{bookingData.location?.address}</p>
            </div>
          </div>
        </div>

        {/* Customer Info Form */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-6 h-6 mr-2 text-emerald-600" />
            {language === 'vi' ? 'Thông tin liên hệ' : 'Contact Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Họ và tên' : 'Full Name'}
              </label>
              <input
                type="text"
                value={bookingData.customerInfo.name}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  customerInfo: { ...bookingData.customerInfo, name: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={language === 'vi' ? 'Nhập họ và tên' : 'Enter full name'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={bookingData.customerInfo.phone}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  customerInfo: { ...bookingData.customerInfo, phone: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={language === 'vi' ? 'Nhập số điện thoại' : 'Enter phone number'}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={bookingData.customerInfo.email}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  customerInfo: { ...bookingData.customerInfo, email: e.target.value }
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={language === 'vi' ? 'Nhập địa chỉ email' : 'Enter email address'}
              />
            </div>
          </div>
        </div>
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
          onClick={handleNext}
          disabled={!bookingData.customerInfo.name || !bookingData.customerInfo.phone}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{language === 'vi' ? 'Xác nhận đặt lịch' : 'Confirm Booking'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;