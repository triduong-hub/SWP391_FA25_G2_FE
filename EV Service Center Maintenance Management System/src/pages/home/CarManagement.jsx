import React, { useState, useEffect } from "react";
import api from "../../../api";
import { Edit, Trash2, FileText, X, Wrench } from "lucide-react";


const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/vehicle/getAll");
        console.log("Dữ liệu xe từ API:", response.data);
        setCars(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách xe:", error);
      }
    };

    fetchCars();
  }, []);

  const handleAdd = () => {
    alert("➕ Thêm xe mới");
  };

  const handleEdit = (id) => {
    alert("✏️ Sửa thông tin xe ID: " + id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa xe ID: " + id + " ?")) {
      setCars(cars.filter((c) => c.id !== id));
    }
  };

  const handleViewHistory = async (vehicleId, licensePlate) => {
    setIsHistoryOpen(true);
    setLoadingHistory(true);
    setSelectedPlate(licensePlate);
    setSelectedHistory([]); // Reset dữ liệu cũ

    try {
      // Gọi API bạn vừa viết ở Backend
      const response = await api.get(`/maintenances/vehicle/${vehicleId}`);
      // Backend trả về: { data: [...] } nên lấy response.data.data
      setSelectedHistory(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử bảo dưỡng:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const closeHistoryModal = () => {
    setIsHistoryOpen(false);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">🚗 Danh sách xe điện</h3>
        {/* <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          Thêm xe
        </button> */}
      </div>

      {/* Table */}
      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow">
        <table className="w-full border-collapse bg-white/90 backdrop-blur text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 uppercase text-center">
              <th className="p-3 w-[6%]">ID</th>
              <th className="p-3 w-[22%] text-left">Chủ sở hữu</th>
              <th className="p-3 w-[15%]">Biển số</th>
              <th className="p-3 w-[20%]">Mẫu xe</th>
              <th className="p-3 w-[20%]">VIN</th>
              <th className="p-3 w-[17%]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr
                key={car.vehicleID || index}
                className="border-b hover:bg-emerald-50/60 transition text-gray-900 text-center align-middle"
              >
                <td className="p-3 font-medium align-middle">{car.vehicleID}</td>
                <td className="p-3 text-left align-middle whitespace-nowrap">
                  {car.customerName}
                </td>
                <td className="p-3 align-middle">{car.licensePlate}</td>
                <td className="p-3 align-middle">
                  {car.model?.modelName || "Không rõ"}
                </td>
                <td className="p-3 align-middle">{car.vin || "Không rõ"}</td>
                <td className="px-4 py-2 flex justify-center space-x-3">
                  <button
                    onClick={() => handleEdit(car.vehicleID)}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(car.vehicleID)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {cars.length === 0 && (
          <p className="p-4 text-gray-500 text-center">Không có dữ liệu xe.</p>
        )}
      </div>
      {/* --- MODAL LỊCH SỬ BẢO DƯỠNG --- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5" />
                <h3 className="text-lg font-bold">Lịch sử bảo dưỡng - {selectedPlate}</h3>
              </div>
              <button
                onClick={closeHistoryModal}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingHistory ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                  <FileText className="w-12 h-12 mb-2 opacity-20" />
                  <p>Chưa có lịch sử bảo dưỡng nào.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedHistory.map((item) => (
                    <div key={item.maintenanceID} className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-200 text-gray-700'
                            }`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ID: #{item.maintenanceID}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-indigo-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.cost || 0)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                        <p><span className="font-medium text-gray-500">Ngày bắt đầu:</span> {new Date(item.startTime).toLocaleDateString('vi-VN')}</p>
                        <p><span className="font-medium text-gray-500">Ngày kết thúc:</span> {item.endTime ? new Date(item.endTime).toLocaleDateString('vi-VN') : '---'}</p>
                        <p className="col-span-2"><span className="font-medium text-gray-500">Mô tả:</span> {item.description}</p>
                        {item.empName && <p className="col-span-2"><span className="font-medium text-gray-500">Kỹ thuật viên:</span> {item.empName}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={closeHistoryModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-medium text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManagement;
