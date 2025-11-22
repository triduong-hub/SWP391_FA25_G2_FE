import React from "react";
import { Plus, Wrench, AlertCircle } from "lucide-react"; // Thêm icon Wrench, AlertCircle
import { useLanguage } from "../../contexts/LanguageContext";

const VehicleSelection = ({ vehicles, onVehicleSelect, onAddNewVehicle }) => {
  const { language } = useLanguage();
  const defaultImg = "https://res.cloudinary.com/dq5skmidv/image/upload/v1761475245/VF3_hhgnvh.jpg";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === "vi" ? "Chọn xe của bạn" : "Select Your Vehicle"}
        </h2>
        <p className="text-gray-600">
          {language === "vi"
            ? "Chọn xe cần bảo dưỡng hoặc thêm xe mới vào hệ thống"
            : "Choose the vehicle for maintenance or add a new vehicle"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle, index) => {
          // 🛠️ Logic kiểm tra trạng thái bảo dưỡng
          // Giả sử: status === false là đang bảo dưỡng/không sẵn sàng
          const isUnderMaintenance = vehicle.status === false; 

          return (
            <div
              key={vehicle.id || vehicle.licensePlate || index}
              onClick={() => {
                // ⛔ Nếu đang bảo dưỡng thì không cho click chọn
                if (!isUnderMaintenance) {
                  onVehicleSelect(vehicle);
                }
              }}
              className={`relative rounded-2xl p-6 shadow-lg transition-all duration-300 border group
                ${isUnderMaintenance
                  ? "bg-gray-50 border-yellow-400 cursor-not-allowed opacity-90" // Style cho xe đang bảo dưỡng
                  : "bg-white border-gray-100 hover:border-emerald-200 hover:shadow-xl cursor-pointer" // Style cho xe sẵn sàng
                }
              `}
            >
              {/* 🏷️ BADGE TRẠNG THÁI BẢO DƯỠNG */}
              {isUnderMaintenance && (
                <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full shadow-sm border border-yellow-200">
                  <Wrench className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {language === "vi" ? "Đang bảo dưỡng" : "Under Maintenance"}
                  </span>
                </div>
              )}

              <img
                src={
                  (() => {
                    const img =
                      vehicle.image ||
                      vehicle.imageURL ||
                      vehicle.modelImage ||
                      vehicle.model?.image ||
                      "";

                    if (!img) return defaultImg;
                    if (img.startsWith("http")) return img;
                    return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${img}`;
                  })()
                }
                alt={`${vehicle.brand} ${vehicle.model}`}
                onError={(e) => (e.target.src = defaultImg)}
                className={`w-full h-48 object-cover rounded-xl mb-4 transition-transform duration-300 
                  ${isUnderMaintenance ? "grayscale-[30%]" : "group-hover:scale-105"}
                `}
              />

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
                  <span>
                    {(() => {
                      const brand = vehicle.brand?.trim() || "";
                      const model = vehicle.model?.trim() || "";
                      if (brand && model && model.toLowerCase().startsWith(brand.toLowerCase())) {
                        return model;
                      }
                      return `${brand} ${model}`.trim() || "Unknown";
                    })()}
                  </span>
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    {language === "vi" ? "Biển số" : "License Plate"}:{" "}
                    <span className="font-semibold text-gray-800">{vehicle.licensePlate || "—"}</span>
                  </p>
                  
                  {/* Nếu đang bảo dưỡng, hiện thêm dòng cảnh báo nhỏ bên dưới */}
                  {isUnderMaintenance && (
                    <span className="text-xs text-yellow-600 flex items-center">
                       <AlertCircle className="w-3 h-3 mr-1" />
                       {language === "vi" ? "Không thể chọn" : "Unavailable"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* 🆕 Thêm xe mới */}
        <div
          onClick={onAddNewVehicle}
          className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-400 group flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="bg-emerald-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {language === "vi" ? "Thêm xe mới" : "Add New Vehicle"}
          </h3>
          <p className="text-gray-600 text-center">
            {language === "vi"
              ? "Thêm xe mới vào hệ thống để đặt lịch bảo dưỡng"
              : "Add a new vehicle to the system for maintenance booking"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;