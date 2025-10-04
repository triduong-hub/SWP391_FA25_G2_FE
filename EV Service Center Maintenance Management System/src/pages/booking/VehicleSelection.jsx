import React from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const VehicleSelection = ({ vehicles, onVehicleSelect, onAddNewVehicle }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === 'vi' ? 'Chọn xe của bạn' : 'Select Your Vehicle'}
        </h2>
        <p className="text-gray-600">
          {language === 'vi' 
            ? 'Chọn xe cần bảo dưỡng hoặc thêm xe mới vào hệ thống'
            : 'Choose the vehicle for maintenance or add a new vehicle'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => onVehicleSelect(vehicle)}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-emerald-200 group"
          >
            <img
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-gray-600">{language === 'vi' ? 'Năm sản xuất' : 'Year'}: {vehicle.year}</p>
              <p className="text-gray-600">{language === 'vi' ? 'Biển số' : 'License Plate'}: {vehicle.licensePlate}</p>
            </div>
          </div>
        ))}

        {/* Add New Vehicle Card */}
        <div
          onClick={onAddNewVehicle}
          className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-400 group flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="bg-emerald-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {language === 'vi' ? 'Thêm xe mới' : 'Add New Vehicle'}
          </h3>
          <p className="text-gray-600 text-center">
            {language === 'vi' 
              ? 'Thêm xe mới vào hệ thống để đặt lịch bảo dưỡng'
              : 'Add a new vehicle to the system for maintenance booking'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;