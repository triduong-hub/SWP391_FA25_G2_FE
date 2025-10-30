import React from "react";
import { Plus } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const VehicleSelection = ({ vehicles, onVehicleSelect, onAddNewVehicle }) => {
  const { language } = useLanguage();
  const defaultImg = "https://res.cloudinary.com/dq5skmidv/image/upload/v1761475245/VF3_hhgnvh.jpg";
  console.log('vehicles', vehicles);

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
        {vehicles.map((vehicle, index) => (
          <div
            key={vehicle.id || vehicle.licensePlate || index} // ✅ key duy nhất
            onClick={() => onVehicleSelect(vehicle)}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-emerald-200 group"
          >
            <img
              src={
                (() => {
                  // ✅ Ưu tiên các field ảnh có thể có trong dữ liệu API
                  const img =
                    vehicle.image ||
                    vehicle.imageURL ||
                    vehicle.modelImage ||
                    vehicle.model?.image ||
                    "";

                  // Nếu không có ảnh → dùng ảnh mặc định
                  if (!img) return defaultImg;

                  // Nếu là link đầy đủ (Cloudinary, S3, …) → dùng luôn
                  if (img.startsWith("http")) return img;

                  // Nếu chỉ là đường dẫn tương đối → tự ghép với baseURL backend
                  return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}${img}`;
                })()
              }
              alt={`${vehicle.brand || "Car"} ${vehicle.model || ""}`}
              onError={(e) => (e.target.src = defaultImg)}
              className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                {(() => {
                  const brand = vehicle.brand?.trim() || "";
                  const model = vehicle.model?.trim() || "";
                  // ⚙️ Nếu model đã bắt đầu bằng brand thì chỉ hiển thị model
                  if (
                    brand &&
                    model &&
                    model.toLowerCase().startsWith(brand.toLowerCase())
                  ) {
                    return model;
                  }
                  return `${brand} ${model}`.trim() || "Unknown";
                })()}
              </h3>

              {/* <p className="text-gray-600">
                {language === "vi" ? "Năm sản xuất" : "Year"}:{" "}
                {vehicle.year || "—"}
              </p> */}
              <p className="text-gray-600">
                {language === "vi" ? "Biển số" : "License Plate"}:{" "}
                {vehicle.licensePlate || "—"}
              </p>
            </div>
          </div>
        ))}

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
