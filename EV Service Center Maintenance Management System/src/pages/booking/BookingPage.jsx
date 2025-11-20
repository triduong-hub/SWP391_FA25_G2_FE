import React, { useState, useEffect, useCallback } from 'react';
import { Car, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import LanguageSwitcher from '../../contexts/LanguageSwitcher.jsx';
import BookingSteps from './BookingSteps.jsx';
import VehicleSelection from './VehicleSelection.jsx';
import AddVehicleForm from './AddVehicleForm.jsx';
import ServiceSelection from './ServiceSelection.jsx';
import DateTimeSelection from './DateTimeSelection.jsx';
import BookingConfirmation from './BookingConfirmation.jsx';

// import PaymentForm from './PaymentForm.jsx';
import API from '../../../api.js';

const BookingPage = ({ onBack }) => {
  const { language } = useLanguage();

  // 🧍‍♂️ Lấy thông tin khách hàng từ localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = storedUser.userID || null;
  const customerName = storedUser.name || '';
  const customerPhone = storedUser.phone || '';
  const customerEmail = storedUser.email || '';

  if (!customerId) {
    console.warn('⚠️ Không tìm thấy customerId trong localStorage:', storedUser);
  }

  // 🌟 State chính
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // 📦 Dữ liệu booking tạm thời
  const [bookingData, setBookingData] = useState({
    vehicle: null,
    services: [],
    datetime: '',
    location: '',
    customerInfo: {
      id: customerId,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
    },
    paymentMethod: 'cash',
  });

  const fetchVehicles = useCallback(async () => {
    if (!customerId) return;
    setLoadingVehicles(true);
    try {
      console.log('🔄 Đang tải danh sách xe...');
      const response = await API.get(`/vehicle/getByCustomerId/${customerId}`);
      const vehicleList = response.data?.data || [];

      const formattedVehicles = vehicleList.map((v) => ({
        id: v.vehicleID || v.id,
        brand: v.model?.modelName || "Unknown",
        model: v.model?.modelName || "Unknown",
        year: v.year,
        licensePlate: v.licensePlate,
        // Logic ưu tiên ảnh xe riêng -> ảnh model -> ảnh mặc định
        image: v.imageUrl || v.model?.imageUrl || "https://res.cloudinary.com/dq5skmidv/image/upload/v1761475245/VF3_hhgnvh.jpg",
      }));

      console.log('✅ Danh sách xe đã tải:', formattedVehicles);
      setVehicles(formattedVehicles);
    } catch (error) {
      console.error('❌ Lỗi khi lấy xe:', error);
    } finally {
      setLoadingVehicles(false);
    }
  }, [customerId]);

  // 🚗 Lấy danh sách xe của khách hàng
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // 🚘 Chọn xe
  const handleVehicleSelect = (vehicle) => {
    setBookingData((prev) => ({ ...prev, vehicle }));
    setCurrentStep(3);
  };

  // 🧩 Chọn hoặc bỏ chọn dịch vụ
  const handleServiceToggle = (service) => {
    setBookingData((prev) => {
      const serviceId = service.serviceID || service.id;
      const exists = prev.services.some((s) => (s.serviceID || s.id) === serviceId);

      const updatedServices = exists
        ? prev.services.filter((s) => (s.serviceID || s.id) !== serviceId)
        : [...prev.services, service];

      return { ...prev, services: updatedServices };
    });
  };

  // 📅 Chọn ngày giờ và địa điểm
  const handleDateTimeSelect = (date, time, location) => {
    setBookingData((prev) => ({
      ...prev,
      datetime: `${date} ${time}`,
      location,
    }));
  };

  console.log('🚗 Vehicles to render:', vehicles);
  console.log('🧾 Booking Data:', bookingData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      <LanguageSwitcher />

      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'vi' ? 'Quay lại trang chủ' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-2xl">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {language === 'vi' ? 'Đặt lịch bảo dưỡng' : 'Book Maintenance'}
              </h1>
              <p className="text-gray-600">
                {language === 'vi'
                  ? 'Đặt lịch bảo dưỡng xe điện của bạn'
                  : 'Schedule your EV maintenance'}
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <BookingSteps currentStep={currentStep} />

        {/* Nội dung chính */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {loadingVehicles ? (
            <p className="text-center text-gray-500">Đang tải xe...</p>
          ) : (
            <>
              {currentStep === 1 && (
                <VehicleSelection
                  vehicles={vehicles}
                  onVehicleSelect={handleVehicleSelect}
                  onAddNewVehicle={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <AddVehicleForm
                  onBack={() => setCurrentStep(1)}
                  onNext={async () => {
                    setCurrentStep(1);
                    
                    setTimeout(async () => {
                        await fetchVehicles(); 
                    }, 3000);
                  }}
                />
              )}


              {currentStep === 3 && (
                <ServiceSelection
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  onServiceToggle={handleServiceToggle}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(4)}
                />
              )}

              {currentStep === 4 && (
                <DateTimeSelection
                  onDateTimeSelect={handleDateTimeSelect}
                  onBack={() => setCurrentStep(3)}
                  onNext={() => setCurrentStep(5)}
                />
              )}

              {currentStep === 5 && (
                <BookingConfirmation
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  onBack={() => setCurrentStep(4)}
                  onNext={() => setCurrentStep(6)}
                />
              )}

              {/* {currentStep === 6 && (
                <PaymentForm
                  bookingData={bookingData}
                  setBookingData={setBookingData}
                  onBack={() => setCurrentStep(5)}
                  onComplete={onBack}
                />
              )} */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
