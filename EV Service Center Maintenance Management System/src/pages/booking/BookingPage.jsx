import React, { useState } from 'react';
import { Car, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import LanguageSwitcher from '../../contexts/LanguageSwitcher.jsx';
import BookingSteps from './BookingSteps.jsx';
import VehicleSelection from './VehicleSelection.jsx';
import AddVehicleForm from './AddVehicleForm.jsx';
import ServiceSelection from './ServiceSelection.jsx';
import DateTimeSelection from './DateTimeSelection.jsx';
import BookingConfirmation from './BookingConfirmation.jsx';
import PaymentForm from './PaymentForm.jsx';

const BookingPage = ({ onBack }) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    vehicle: null,
    services: [],
    datetime: '',
    location: '',
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    },
    paymentMethod: 'cash'
  });

  // Sample vehicles data
  const vehicles = [
    {
      id: 1,
      brand: 'Tesla',
      model: 'Model 3',
      year: 2023,
      licensePlate: '30A-12345',
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 2,
      brand: 'VinFast',
      model: 'VF8',
      year: 2024,
      licensePlate: '51G-67890',
      image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    }
  ];

  const handleVehicleSelect = (vehicle) => {
    setBookingData({ ...bookingData, vehicle });
    setCurrentStep(3);
  };

  const handleServiceToggle = (service) => {
    const isSelected = bookingData.services.find(s => s.id === service.id);
    let newServices;
    
    if (isSelected) {
      newServices = bookingData.services.filter(s => s.id !== service.id);
    } else {
      newServices = [...bookingData.services, service];
    }
    
    setBookingData({ ...bookingData, services: newServices });
  };

  const handleDateTimeSelect = (date, time, location) => {
    setBookingData({ 
      ...bookingData, 
      datetime: `${date} ${time}`,
      location: location
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      <LanguageSwitcher />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
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
                {language === 'vi' ? 'Đặt lịch bảo dưỡng xe điện của bạn' : 'Schedule your EV maintenance'}
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <BookingSteps currentStep={currentStep} />

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
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
              onNext={() => setCurrentStep(3)}
            />
          )}
          
          {currentStep === 3 && (
            <ServiceSelection
              bookingData={bookingData}
              onServiceToggle={handleServiceToggle}
              onBack={() => setCurrentStep(bookingData.vehicle ? 1 : 2)}
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
          
          {currentStep === 6 && (
            <PaymentForm
              bookingData={bookingData}
              setBookingData={setBookingData}
              onBack={() => setCurrentStep(5)}
              onComplete={onBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;