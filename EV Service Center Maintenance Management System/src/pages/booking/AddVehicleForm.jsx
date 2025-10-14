import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import API from "../../../api";
import { useLanguage } from "../../contexts/LanguageContext";

const AddVehicleForm = ({ onBack, onNext }) => {
  const { language } = useLanguage();

  // State
  const [models, setModels] = useState([]); // danh sách mẫu xe lấy từ API
  const [selectedModel, setSelectedModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [vin, setVin] = useState("");

  // Gọi API để lấy danh sách mẫu xe khi component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await API.get("/model"); // ví dụ endpoint
        setModels(res.data || []);
      } catch (err) {
        console.error(" Lỗi khi tải danh sách mẫu xe:", err);
        alert(
          language === "vi"
            ? "Không tải được danh sách mẫu xe!"
            : "Failed to load vehicle models!"
        );
      }
    };

    fetchModels();
  }, [language]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedModel || !licensePlate || !vin) {
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
        modelID: selectedModel,
        mileage: 0,
        lastMaintenanceDate: new Date().toISOString().split("T")[0],
        lastMaintenanceMileage: 0,
        status: true,
      };
      console.log('newVehicle', newVehicle);

      // Gọi API tạo xe
      const response = await API.post("/vehicle/create", newVehicle);
      console.log(" Tạo xe thành công:", response.data);

      setMessage("Thêm xe thành công!");
      setMessageType("success");

      onNext(newVehicle);
    } catch (error) {
      console.error("❌ Lỗi khi thêm xe:", error);
      setMessage("Thêm xe thất bại!");
      setMessageType("error");
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
          {message && (
            <div
              className={`p-3 mb-4 rounded-xl text-center font-medium ${messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {message}
            </div>
          )}

          {/* Mẫu xe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "vi" ? "Mẫu xe VinFast" : "VinFast Model"}
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">
                {language === "vi" ? "Chọn mẫu xe" : "Select model"}
              </option>
              {models.map((m) => (
                <option key={m.modelID} value={m.modelID}>
                  {m.modelName}
                </option>
              ))}
            </select>
          </div>

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
