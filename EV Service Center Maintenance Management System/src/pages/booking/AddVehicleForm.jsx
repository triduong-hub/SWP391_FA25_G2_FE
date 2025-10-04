import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AddVehicleForm = ({ onBack, onNext }) => {
  const { language } = useLanguage();

  // Danh sách mẫu xe VinFast + màu + năm sản xuất
  const vinfastModels = {
    'VF 3': {
      years: [2024, 2025],
      colors: ['Trắng', 'Đen', 'Xanh dương', 'Đỏ', 'Xám bạc'],
    },
    'VF 5 Plus': {
      years: [2023, 2024, 2025],
      colors: ['Trắng', 'Vàng cát', 'Xanh ngọc', 'Bạc', 'Đen'],
    },
    'VF 6': {
      years: [2024, 2025],
      colors: ['Trắng', 'Xám', 'Đen', 'Cam đồng', 'Xanh dương'],
    },
    'VF 7': {
      years: [2024, 2025],
      colors: ['Trắng', 'Xanh đậm', 'Bạc', 'Đen', 'Đỏ đô'],
    },
    'VF 8': {
      years: [2022, 2023, 2024, 2025],
      colors: ['Trắng', 'Đen', 'Đỏ', 'Xanh dương', 'Xám bạc'],
    },
    'VF 9': {
      years: [2023, 2024, 2025],
      colors: ['Trắng', 'Đen', 'Bạc', 'Xanh đậm', 'Nâu đồng'],
    },
    'Lux A2.0': {
      years: [2019, 2020, 2021, 2022],
      colors: ['Trắng', 'Đen', 'Xanh đậm', 'Bạc', 'Đỏ'],
    },
    'Lux SA2.0': {
      years: [2019, 2020, 2021, 2022],
      colors: ['Trắng', 'Đen', 'Bạc', 'Nâu', 'Đỏ'],
    },
    'Fadil': {
      years: [2019, 2020, 2021, 2022],
      colors: ['Trắng', 'Đỏ', 'Xanh', 'Bạc', 'Xám'],
    },
    'President': {
      years: [2020, 2021],
      colors: ['Đen', 'Trắng', 'Xanh đậm', 'Bạc'],
    },
  };

  // State
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!model || !color || !year || !licensePlate) {
      alert(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin!' : 'Please fill in all fields!');
      return;
    }

    const newVehicle = {
      brand: 'VinFast',
      model,
      color,
      year,
      licensePlate,
    };

    onNext(newVehicle);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Thêm xe VinFast mới' : 'Add New VinFast Vehicle'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi'
            ? 'Chọn mẫu xe, màu sắc và nhập thông tin xe của bạn'
            : 'Select your VinFast model, color, and vehicle details'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Mẫu xe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'vi' ? 'Mẫu xe VinFast' : 'VinFast Model'}
            </label>
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setColor('');
                setYear('');
              }}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">{language === 'vi' ? 'Chọn mẫu xe' : 'Select model'}</option>
              {Object.keys(vinfastModels).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Màu xe */}
          {model && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Màu xe' : 'Color'}
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">{language === 'vi' ? 'Chọn màu xe' : 'Select color'}</option>
                {vinfastModels[model].colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Năm sản xuất */}
          {model && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'vi' ? 'Năm sản xuất' : 'Year'}
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">{language === 'vi' ? 'Chọn năm sản xuất' : 'Select year'}</option>
                {vinfastModels[model].years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {/* Biển số xe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'vi' ? 'Biển số xe' : 'License Plate'}
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="30A-12345"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Nút điều hướng */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl 
              font-semibold hover:bg-gray-200 transition-colors duration-200 
              flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white 
              py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 
              transition-all duration-300 flex items-center justify-center space-x-2"
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
