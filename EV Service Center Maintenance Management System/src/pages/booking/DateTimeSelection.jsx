import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const DateTimeSelection = ({ onDateTimeSelect, onBack, onNext }) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const locations = [
    {
      id: 1,
      name: language === 'vi' ? 'Trung tâm Quận 1' : 'District 1 Center',
      address: language === 'vi' ? '123 Đường Nguyễn Huệ, Quận 1, TP.HCM' : '123 Nguyen Hue St, District 1, HCMC',
      phone: '(028) 1234 5678'
    },
    {
      id: 2,
      name: language === 'vi' ? 'Trung tâm Quận 7' : 'District 7 Center',
      address: language === 'vi' ? '456 Đường Nguyễn Thị Thập, Quận 7, TP.HCM' : '456 Nguyen Thi Thap St, District 7, HCMC',
      phone: '(028) 8765 4321'
    },
    {
      id: 3,
      name: language === 'vi' ? 'Trung tâm Thủ Đức' : 'Thu Duc Center',
      address: language === 'vi' ? '789 Đường Võ Văn Ngân, TP. Thủ Đức, TP.HCM' : '789 Vo Van Ngan St, Thu Duc City, HCMC',
      phone: '(028) 9876 5432'
    }
  ];

  const handleNext = () => {
    if (selectedDate && selectedTime && selectedLocation) {
      onDateTimeSelect(selectedDate, selectedTime, selectedLocation);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Chọn thời gian & địa điểm' : 'Select Time & Location'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi' 
            ? 'Chọn thời gian và địa điểm thuận tiện cho bạn'
            : 'Choose a convenient time and location for you'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Date & Time Selection */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-emerald-600" />
              {language === 'vi' ? 'Chọn ngày' : 'Select Date'}
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-emerald-600" />
              {language === 'vi' ? 'Chọn giờ' : 'Select Time'}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    selectedTime === time
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
            {language === 'vi' ? 'Chọn địa điểm' : 'Select Location'}
          </h3>
          <div className="space-y-4">
            {locations.map((location) => (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedLocation?.id === location.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-200 bg-white'
                }`}
              >
                <h4 className="font-bold text-gray-900 mb-1">{location.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{location.address}</p>
                <p className="text-emerald-600 text-sm font-medium">{location.phone}</p>
              </div>
            ))}
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
          disabled={!selectedDate || !selectedTime || !selectedLocation}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{language === 'vi' ? 'Tiếp tục' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;