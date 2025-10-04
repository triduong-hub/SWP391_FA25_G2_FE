import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AddVehicleForm = ({ onBack, onNext }) => {
  const { language } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Thêm xe mới' : 'Add New Vehicle'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi' 
            ? 'Nhập thông tin xe của bạn để thêm vào hệ thống'
            : 'Enter your vehicle information to add to the system'
          }
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Hãng xe' : 'Brand'}
              </label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">
                  {language === 'vi' ? 'Chọn hãng xe' : 'Select Brand'}
                </option>
                <option value="tesla">Tesla</option>
                <option value="vinfast">VinFast</option>
                <option value="bmw">BMW</option>
                <option value="audi">Audi</option>
                <option value="mercedes">Mercedes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Mẫu xe' : 'Model'}
              </label>
              <input
                type="text"
                placeholder={language === 'vi' ? 'Nhập mẫu xe' : 'Enter model'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Năm sản xuất' : 'Year'}
              </label>
              <input
                type="number"
                placeholder="2024"
                min="2010"
                max="2024"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Biển số xe' : 'License Plate'}
              </label>
              <input
                type="text"
                placeholder="30A-12345"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'vi' ? 'Màu xe' : 'Color'}
            </label>
            <input
              type="text"
              placeholder={language === 'vi' ? 'Nhập màu xe' : 'Enter color'}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>{language === 'vi' ? 'Thêm xe' : 'Add Vehicle'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleForm;