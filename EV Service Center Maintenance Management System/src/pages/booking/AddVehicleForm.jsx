import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import API from "../../../api";
import { useLanguage } from "../../contexts/LanguageContext";

const AddVehicleForm = ({ onBack, onNext }) => {
  const { language } = useLanguage();

  // Danh sách mẫu xe VinFast + năm sản xuất
  const vinfastModels = {
    "VF 3": [2024, 2025],
    "VF 5 Plus": [2023, 2024, 2025],
    "VF 6": [2024, 2025],
    "VF 7": [2024, 2025],
    "VF 8": [2022, 2023, 2024, 2025],
    "VF 9": [2023, 2024, 2025],
    "Lux A2.0": [2019, 2020, 2021, 2022],
    "Lux SA2.0": [2019, 2020, 2021, 2022],
    "Fadil": [2019, 2020, 2021, 2022],
    "President": [2020, 2021],
  };

  // State
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vin, setVin] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!model || !year || !licensePlate || !vin) {
      alert(
        language === "vi"
          ? "Vui lòng điền đầy đủ thông tin!"
          : "Please fill in all fields!"
      );
      return;
    }

    try {
      // Lấy user ID từ localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const customerId = storedUser.userID;

      if (!customerId) {
        alert(
          language === "vi"
            ? "Không tìm thấy thông tin khách hàng!"
            : "Customer info not found!"
        );
        return;
      }

      const newVehicle = {
        customerId,
        licensePlate,
        vin,
        type: "electric",
        model,
        year: parseInt(year),
        mileage: 0,
        lastMaintenanceDate: new Date().toISOString().split("T")[0],
        lastMaintenanceMileage: 0,
        status: true,
      };

      // Gọi API tạo xe
      const response = await API.post("/vehicle/create", newVehicle);
      console.log("✅ Tạo xe thành công:", response.data);

      alert(
        language === "vi"
          ? "Thêm xe thành công!"
          : "Vehicle added successfully!"
      );

      onNext(newVehicle);
    } catch (error) {
      console.error("❌ Lỗi khi thêm xe:", error);
      alert(
        language === "vi"
          ? "Thêm xe thất bại!"
          : "Failed to add vehicle!"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {language === "vi" ? "Thêm xe VinFast mới" : "Add New VinFast Vehicle"}
        </h2>
        <p className="text-gray-600">
          {language === "vi"
            ? "Nhập thông tin xe của bạn để tạo mới"
            : "Enter your VinFast vehicle details"}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Mẫu xe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "vi" ? "Mẫu xe VinFast" : "VinFast Model"}
            </label>
            <select
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setYear("");
              }}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">
                {language === "vi" ? "Chọn mẫu xe" : "Select model"}
              </option>
              {Object.keys(vinfastModels).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Năm sản xuất */}
          {model && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "vi" ? "Năm sản xuất" : "Year"}
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">
                  {language === "vi" ? "Chọn năm sản xuất" : "Select year"}
                </option>
                {vinfastModels[model].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mã VIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "vi" ? "Mã VIN" : "VIN Number"}
            </label>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="VD: VF8ABC12345XYZ"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Biển số xe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "vi" ? "Biển số xe" : "License Plate"}
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="VD: 30A-12345"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Nút điều hướng */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === "vi" ? "Quay lại" : "Back"}</span>
            </button>

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>{language === "vi" ? "Thêm xe" : "Add Vehicle"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddVehicleForm;
