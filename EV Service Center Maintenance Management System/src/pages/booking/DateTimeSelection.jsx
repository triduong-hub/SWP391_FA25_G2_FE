import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import API from '../../../api';
import { v4 as uuidv4 } from 'uuid';

const DateTimeSelection = ({ onDateTimeSelect, onBack, onNext }) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Fetch service centers từ API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await API.get('/service-centers/getAll');
        // const data = (response.data || []).map((loc) => ({
        //   key: loc.id || loc.locationID || loc.serviceCenterID || uuidv4(),
        //   id: loc.id || loc.locationID || loc.serviceCenterID,
        //   name: language === 'vi' ? loc.name_vi || loc.name : loc.name_en || loc.name,
        //   address: language === 'vi' ? loc.address_vi || loc.address : loc.address_en || loc.address,
        //   phone: loc.phone,
        // })); // giống logic ở dưới nhưng chưa đầy đủ
        const data = (response.data || []).map((loc) => {
          const locId = loc.id || loc.locationID || loc.serviceCenterID; // 🟢 lấy đúng ID dù tên khác nhau
          return {
            key: locId || uuidv4(), // fallback tạo key nếu không có
            id: locId,
            name:
              language === 'vi'
                ? loc.name_vi || loc.name
                : loc.name_en || loc.name,
            address:
              language === 'vi'
                ? loc.address_vi || loc.address
                : loc.address_en || loc.address,
            phone: loc.phone,
          };
        });
        setLocations(data);
      } catch (error) {
        console.error('Lỗi khi fetch locations:', error);
      }
    };
    fetchLocations();
  }, [language]);

  // Kiểm tra giờ đã qua
  const isTimePast = (time) => {
    if (!selectedDate) return false;
    const now = new Date();
    const selected = new Date(selectedDate + 'T' + time);
    return selectedDate === now.toISOString().split('T')[0] && selected < now;
  };

  // Next step
  const handleNext = () => {
    if (selectedDate && selectedTime && selectedLocation) {
      onDateTimeSelect(selectedDate, selectedTime, selectedLocation);
      onNext();
    } else {
      alert(language === 'vi'
        ? 'Vui lòng chọn đầy đủ ngày, giờ và địa điểm!'
        : 'Please select date, time, and location!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Chọn thời gian & địa điểm' : 'Select Time & Location'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi'
            ? 'Chọn thời gian và địa điểm thuận tiện cho bạn'
            : 'Choose a convenient time and location for you'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Date & Time */}
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
              {timeSlots.map((time) => {
                const past = isTimePast(time);
                return (
                  <button
                    key={time}
                    onClick={() => !past && setSelectedTime(time)}
                    disabled={past}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${selectedTime === time
                      ? 'bg-emerald-500 text-white'
                      : past
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
            {language === 'vi' ? 'Chọn chi nhánh' : 'Select Branch'}
          </h3>
          <div className="space-y-4">
            {locations.map((location) => {
              const selectedKey = selectedLocation ? selectedLocation.key : null;
              return (
                <div
                  key={location.key}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedKey === location.key
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-200 bg-white'
                    }`}
                >
                  <h4 className="font-bold text-gray-900 mb-1">{location.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{location.address}</p>
                  <p className="text-emerald-600 text-sm font-medium">{location.phone}</p>
                </div>
              );
            })}
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
