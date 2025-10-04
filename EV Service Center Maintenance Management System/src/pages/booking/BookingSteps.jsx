import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const BookingSteps = ({ currentStep }) => {
  const { language } = useLanguage();

  const steps = [
    { number: 1, title: language === 'vi' ? 'Chọn xe' : 'Select Vehicle' },
    { number: 2, title: language === 'vi' ? 'Thêm xe mới' : 'Add New Vehicle' },
    { number: 3, title: language === 'vi' ? 'Chọn dịch vụ' : 'Select Services' },
    { number: 4, title: language === 'vi' ? 'Chọn thời gian' : 'Select Time' },
    { number: 5, title: language === 'vi' ? 'Xác nhận' : 'Confirm' },
    { number: 6, title: language === 'vi' ? 'Thanh toán' : 'Payment' }
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step.number
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span className="text-xs mt-1 text-gray-600 text-center">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${
                currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingSteps;