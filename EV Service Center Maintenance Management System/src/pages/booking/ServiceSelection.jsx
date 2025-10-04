import React from 'react';
import { CheckCircle, Info, ArrowLeft, ArrowRight, Battery, Zap, Shield, Wrench } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ServiceSelection = ({ bookingData, onServiceToggle, onBack, onNext }) => {
  const { language } = useLanguage();

  const services = [
    {
      id: 1,
      name: language === 'vi' ? 'Kiểm tra pin' : 'Battery Check',
      price: 500000,
      duration: 60,
      icon: Battery,
      color: '#10B981',
      description: language === 'vi' 
        ? 'Kiểm tra tình trạng pin, dung lượng và hiệu suất sạc'
        : 'Check battery condition, capacity and charging performance'
    },
    {
      id: 2,
      name: language === 'vi' ? 'Bảo dưỡng động cơ' : 'Motor Service',
      price: 800000,
      duration: 90,
      icon: Zap,
      color: '#3B82F6',
      description: language === 'vi'
        ? 'Kiểm tra và bảo dưỡng hệ thống động cơ điện'
        : 'Check and maintain electric motor system'
    },
    {
      id: 3,
      name: language === 'vi' ? 'Kiểm tra phanh' : 'Brake Inspection',
      price: 300000,
      duration: 45,
      icon: Shield,
      color: '#EF4444',
      description: language === 'vi'
        ? 'Kiểm tra hệ thống phanh và thay má phanh nếu cần'
        : 'Inspect brake system and replace brake pads if needed'
    },
    {
      id: 4,
      name: language === 'vi' ? 'Bảo dưỡng tổng quát' : 'General Maintenance',
      price: 1200000,
      duration: 120,
      icon: Wrench,
      color: '#F59E0B',
      description: language === 'vi'
        ? 'Bảo dưỡng toàn diện tất cả hệ thống của xe'
        : 'Comprehensive maintenance of all vehicle systems'
    }
  ];

  const getTotalPrice = () => {
    return bookingData.services.reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    return bookingData.services.reduce((total, service) => total + service.duration, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Chọn dịch vụ' : 'Select Services'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi' 
            ? 'Chọn các dịch vụ bảo dưỡng bạn cần cho xe của mình'
            : 'Choose the maintenance services you need for your vehicle'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = bookingData.services.find(s => s.id === service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => onServiceToggle(service)}
              className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                isSelected 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <Icon size={24} color={service.color} />
                </div>
                {isSelected && (
                  <div className="bg-emerald-500 text-white p-1 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {service.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatPrice(service.price)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {service.duration} {language === 'vi' ? 'phút' : 'minutes'}
                  </p>
                </div>
                <button className="text-emerald-600 hover:text-emerald-700 p-2">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {bookingData.services.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
          <h4 className="font-bold text-gray-900 mb-4">
            {language === 'vi' ? 'Tóm tắt dịch vụ đã chọn' : 'Selected Services Summary'}
          </h4>
          <div className="space-y-2">
            {bookingData.services.map((service) => (
              <div key={service.id} className="flex justify-between items-center">
                <span className="text-gray-700">{service.name}</span>
                <span className="font-semibold text-gray-900">{formatPrice(service.price)}</span>
              </div>
            ))}
            <div className="border-t border-emerald-200 pt-2 mt-2">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>{language === 'vi' ? 'Tổng cộng' : 'Total'}</span>
                <span className="text-emerald-600">{formatPrice(getTotalPrice())}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'vi' ? 'Thời gian ước tính' : 'Estimated time'}: {getTotalDuration()} {language === 'vi' ? 'phút' : 'minutes'}
              </p>
            </div>
          </div>
        </div>
      )}

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