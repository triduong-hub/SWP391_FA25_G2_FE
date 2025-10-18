import React, { useEffect, useState } from 'react';
import { CheckCircle, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import API from '../../../api';

const ServiceSelection = ({ bookingData, setBookingData, onServiceToggle, onBack, onNext }) => {

  const { language } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Lấy danh sách dịch vụ từ API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await API.get('/services/getAll');
        console.log(' Dữ liệu dịch vụ:', response.data);
        console.table(response.data.data || response.data);
        // 🔧 Chuẩn hóa dữ liệu để đảm bảo ID đồng nhất
        const list = (response.data.data || response.data).map(s => ({
          id: s.serviceID || s.serviceid || s.id,
          name: s.serviceName || s.name || s.service_name,  // 🟢 Đảm bảo có name
          price: s.price || 0,
          duration: s.duration || 0,
        }));

        setServices(list);
      } catch (error) {
        console.error(' Lỗi khi lấy danh sách dịch vụ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Tính tổng giá và thời gian
  const getTotalPrice = () =>
    bookingData.services.reduce((total, service) => total + (service.price || 0), 0);

  const getTotalDuration = () =>
    bookingData.services.reduce(
      (total, service) => total + (service.estimatedTime || 0),
      0
    );

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-10">
        {language === 'vi' ? 'Đang tải dịch vụ...' : 'Loading services...'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Chọn dịch vụ' : 'Select Services'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi'
            ? 'Chọn các dịch vụ bảo dưỡng bạn cần cho xe của mình'
            : 'Choose the maintenance services you need for your vehicle'}
        </p>
      </div>

      {/* Danh sách dịch vụ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => {
          const serviceId = service.serviceID || service.id;
          const isSelected = bookingData.services.some((s) => (s.serviceID || s.id) === serviceId
          );

          return (
            <div
              key={`${serviceId}-${index}`}
              onClick={() => onServiceToggle(service)}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${isSelected
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-100 hover:border-emerald-200'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-50">
                  <Info size={24} color="#10B981" />
                </div>
                {isSelected && (
                  <div className="bg-emerald-500 text-white p-1 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.serviceName || service.name}
              </h3>
              <p className="text-gray-600 mb-3 text-sm">{service.description}</p>

              <div className="space-y-1 text-sm text-gray-500 mb-4">
                <p>🧩 <strong>Component:</strong> {service.component || 'N/A'}</p>
                <p>⚙️ <strong>Type:</strong> {service.serviceType || 'General'}</p>
                <p>⏱ <strong>Estimated Time:</strong> {service.estimatedTime || 'N/A'}</p>
                <p>🛡 <strong>Warranty:</strong> {service.warrantyPeriod
                  ? `${service.warrantyPeriod} months`
                  : 'No warranty'}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {formatPrice(service.price || 0)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tóm tắt dịch vụ đã chọn */}
      {bookingData.services.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
          <h4 className="font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Tóm tắt dịch vụ đã chọn' : 'Selected Services Summary'}
          </h4>
          <div className="space-y-2">
            {bookingData.services.map((service, index) => (
              <div key={`${service.serviceID}-${index}`} className="flex justify-between">
                <span className="text-gray-700">{service.serviceName || service.name}</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(service.price || 0)}
                </span>
              </div>
            ))}
            <div className="border-t border-emerald-200 pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                <span className="text-emerald-600">{formatPrice(getTotalPrice())}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'vi' ? 'Thời gian ước tính' : 'Estimated time'}:{' '}
                {getTotalDuration()} {language === 'vi' ? 'phút' : 'minutes'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
        </button>
        <button
          onClick={onNext}
          disabled={bookingData.services.length === 0}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{language === 'vi' ? 'Tiếp tục' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ServiceSelection;
