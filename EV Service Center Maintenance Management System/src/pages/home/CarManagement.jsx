import React, { useState, useEffect } from "react";
import api from "../../../api";
import ReactDOM from "react-dom";
import {
  Edit,
  Trash2,
  FileText,
  X,
  Wrench,
  Save,
  RotateCw,
  AlertTriangle,
  Gauge,
  StickyNote,
  Search,
  Filter
} from "lucide-react";

const ModalWrapper = ({ children, onClose }) => {
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop: phủ kín màn hình */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Nội dung Modal: nằm giữa màn hình */}
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>,
    document.body
  );
};

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterModel, setFilterModel] = useState("All");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editFormData, setEditFormData] = useState({
    licensePlate: "",
    vin: "",
    mileage: "",
    customerNote: ""
  });
  const [saving, setSaving] = useState(false);

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

  // --- LOGIC TÌM KIẾM & LỌC ---
  // 1. Lấy danh sách các mẫu xe (Model) duy nhất để đưa vào Dropdown
  const uniqueModels = ["All", ...new Set(cars.map((c) => c.model?.modelName).filter(Boolean))];

  // 2. Thực hiện lọc danh sách
  const filteredCars = cars.filter((car) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (car.licensePlate || "").toLowerCase().includes(term) ||
      (car.customerName || "").toLowerCase().includes(term) ||
      (car.vin || "").toLowerCase().includes(term);

    const matchesFilter = filterModel === "All" || car.model?.modelName === filterModel;

    return matchesSearch && matchesFilter;
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await api.get("/vehicle/getAll");
      setCars(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách xe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa xe ID: " + id + " ?")) {
      return;
    }

    try {
      await api.delete(`/vehicle/delete/${id}`);

      // Cập nhật UI: Loại bỏ xe có vehicleID tương ứng
      setCars((prevCars) => prevCars.filter((c) => c.vehicleID !== id));

      alert("Xóa xe thành công!");

    } catch (error) {
      console.error("Lỗi khi xóa xe:", error);
      const errorMsg = error.response?.data || "Lỗi hệ thống";
      alert("Xóa thất bại: " + errorMsg);
    }
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setEditFormData({
      licensePlate: car.licensePlate || "",
      vin: car.vin || "",
      mileage: car.mileage || 0,
      customerNote: car.customerNote || ""
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCar(null);
    setSaving(false);
  };

  // --- 4. XỬ LÝ LƯU CẬP NHẬT (Logic giống VehicleDetail) ---
  const handleUpdate = async () => {
    if (!editingCar) return;

    setSaving(true);
    try {
      const finalPayload = {
        customerId: parseInt(editingCar.customerID, 10),
        modelID: parseInt(editingCar.model?.modelID, 10),
        mileage: parseInt(editFormData.mileage, 10) || 0,
        lastMaintenanceMileage: editingCar.lastMaintenanceMileage,
        type: editingCar.type,
        lastMaintenanceDate: editingCar.lastMaintenanceDate,
        status: editingCar.status,
        licensePlate: editFormData.licensePlate,
        vin: editFormData.vin,
        customerNote: editFormData.customerNote
      };

      await API.patch(`/vehicle/update/${editingCar.vehicleID}`, finalPayload);

      // Cập nhật UI ngay lập tức
      setCars((prevCars) =>
        prevCars.map((c) =>
          c.vehicleID === editingCar.vehicleID
            ? { ...c, ...finalPayload }
            : c
        )
      );

      alert("Cập nhật thông tin xe thành công!");
      closeEditModal();

    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại: " + (error.response?.data?.message || "Lỗi không xác định"));
    } finally {
      setSaving(false);
    }
  };

  // Kiểm tra xem xe đang sửa có bị khóa không (status === false là đang bảo dưỡng)
  const isUnderMaintenance = editingCar?.status === false;
  const isFormValid = editFormData.licensePlate?.trim() && editFormData.vin?.trim();

  const getStatusDetails = (status) => {
    if (!status) return { label: "Không rõ", style: "bg-gray-200 text-gray-600" };
    const normalizedStatus = status.toLowerCase().trim();

    switch (normalizedStatus) {
      // 1. HOÀN THÀNH
      case "completed": case "finish": case "done":
        return { label: "Hoàn thành", style: "bg-green-100 text-green-700 border border-green-200" };

      // 2. ĐANG THỰC HIỆN
      case "in progress": case "in_progress": case "processing":
        return { label: "Đang thực hiện", style: "bg-blue-100 text-blue-700 border border-blue-200" };

      // 3. CHỜ THANH TOÁN
      case "waiting for payment":
        return { label: "Chờ thanh toán", style: "bg-orange-100 text-orange-700 border border-orange-200" };

      // 4. CHỜ KHÁCH DUYỆT (MỚI THÊM)
      case "awaiting_customer_approval": case "awaiting customer approval":
        return { label: "Chờ khách duyệt", style: "bg-purple-100 text-purple-700 border border-purple-200" };

      // 5. CHỜ XỬ LÝ / ĐÃ XÁC NHẬN
      case "confirmed": case "pending": case "scheduled": case "waiting": case "accepted":
        return { label: "Chờ xử lý", style: "bg-yellow-100 text-yellow-800 border border-yellow-200" };

      // 6. ĐÃ HỦY
      case "cancelled": case "canceled": case "rejected": case "đã hủy":
        return { label: "Đã hủy", style: "bg-red-100 text-red-700 border border-red-200" };

      default:
        return { label: status, style: "bg-gray-100 text-gray-600 border border-gray-200" };
    }
  };

  const handleViewHistory = async (vehicleId, licensePlate) => {
    setIsHistoryOpen(true);
    setLoadingHistory(true);
    setSelectedPlate(licensePlate);
    setSelectedHistory([]);

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
      </div>
      {/* --- THANH CÔNG CỤ TÌM KIẾM & FILTER --- */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Input Tìm kiếm */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Tìm biển số, chủ xe, VIN..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white cursor-pointer shadow-sm"
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
          >
            {uniqueModels.map((model) => (
              <option key={model} value={model}>
                {model === "All" ? "Tất cả mẫu xe" : model}
              </option>
            ))}
          </select>
        </div>
      </div>
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
            {/* --- DÙNG filteredCars THAY VÌ cars ĐỂ RENDER --- */}
            {filteredCars.map((car, index) => (
              <tr
                key={car.vehicleID || index}
                className="border-b hover:bg-emerald-50/60 transition text-gray-900 text-center align-middle"
              >
                <td className="p-3 font-medium align-middle">{car.vehicleID}</td>
                <td className="p-3 text-left align-middle whitespace-nowrap">
                  {car.customerName}
                </td>
                <td className="p-3 align-middle font-semibold text-emerald-700">{car.licensePlate}</td>
                <td className="p-3 align-middle">
                  {car.model?.modelName || "Không rõ"}
                </td>
                <td className="p-3 align-middle text-gray-600">{car.vin || "Không rõ"}</td>

                {/* --- CỘT HÀNH ĐỘNG --- */}
                <td className="px-4 py-2 flex justify-center space-x-3">
                  <button
                    onClick={() => openEditModal(car)}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow transition"
                    title="Chỉnh sửa thông tin xe"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(car.vehicleID)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow transition"
                    title="Xóa xe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleViewHistory(car.vehicleID, car.licensePlate)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg shadow transition"
                    title="Xem lịch sử bảo dưỡng"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Thông báo nếu không tìm thấy kết quả */}
        {filteredCars.length === 0 && (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <Search className="w-10 h-10 mb-2 opacity-20" />
            <p>Không tìm thấy xe nào phù hợp.</p>
          </div>
        )}
      </div>
      {/* --- MODAL CẬP NHẬT THÔNG TIN XE (Đã fix backdrop) --- */}
      {isEditModalOpen && editingCar && (
        <ModalWrapper onClose={closeEditModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Edit className="w-5 h-5" /> Cập nhật xe #{editingCar.vehicleID}
              </h3>
              <button onClick={closeEditModal} className="p-1 hover:bg-white/20 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {isUnderMaintenance && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg flex items-start gap-2">
                  <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                  <span>
                    Xe đang trong trạng thái bảo dưỡng. Bạn chỉ có thể xem thông tin, không thể chỉnh sửa.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe</label>
                  <input
                    type="text"
                    value={editFormData.licensePlate}
                    onChange={(e) => setEditFormData({ ...editFormData, licensePlate: e.target.value })}
                    disabled={isUnderMaintenance}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition ${isUnderMaintenance ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã VIN</label>
                  <input
                    type="text"
                    value={editFormData.vin}
                    onChange={(e) => setEditFormData({ ...editFormData, vin: e.target.value })}
                    disabled={isUnderMaintenance}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition ${isUnderMaintenance ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Gauge size={16} /> Số Km hiện tại
                </label>
                <input
                  type="number"
                  value={editFormData.mileage}
                  onChange={(e) => setEditFormData({ ...editFormData, mileage: e.target.value })}
                  disabled={isUnderMaintenance}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition ${isUnderMaintenance ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                    }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <StickyNote size={16} /> Ghi chú (Tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={editFormData.customerNote}
                  onChange={(e) => setEditFormData({ ...editFormData, customerNote: e.target.value })}
                  disabled={isUnderMaintenance}
                  placeholder="Nhập ghi chú về tình trạng xe..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition resize-none ${isUnderMaintenance ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                    }`}
                />
              </div>

              <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                * Thông tin mẫu xe: <strong>{editingCar.model?.modelName}</strong> ({editingCar.type}) <br />
                * Không thể thay đổi mẫu xe tại đây.
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                {isUnderMaintenance ? "Đóng" : "Hủy"}
              </button>

              {!isUnderMaintenance && (
                <button
                  onClick={handleUpdate}
                  disabled={saving || !isFormValid}
                  className={`px-6 py-2 text-white font-medium rounded-lg shadow transition flex items-center gap-2 ${saving || !isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                >
                  {saving ? <RotateCw className="animate-spin" size={18} /> : <Save size={18} />}
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              )}
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* --- MODAL LỊCH SỬ BẢO DƯỠNG (Đã fix backdrop) --- */}
      {isHistoryOpen && (
        <ModalWrapper onClose={() => setIsHistoryOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5" />
                <h3 className="text-lg font-bold">Lịch sử bảo dưỡng - {selectedPlate}</h3>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>

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
                  {selectedHistory.map((item) => {
                    const statusInfo = getStatusDetails(item.status);
                    return (
                      <div key={item.maintenanceID} className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.style}`}>
                              {statusInfo.label}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">ID: #{item.maintenanceID}</span>
                          </div>
                          <div className="text-sm font-bold text-indigo-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.cost || 0)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                          <p><span className="font-medium text-gray-500">Ngày bắt đầu:</span> {new Date(item.startTime).toLocaleDateString('vi-VN')}</p>
                          <p><span className="font-medium text-gray-500">Ngày kết thúc:</span> {item.endTime ? new Date(item.endTime).toLocaleDateString('vi-VN') : '---'}</p>
                          <p className="col-span-2"><span className="font-medium text-gray-500">Mô tả:</span> {item.description ? item.description.replace('Maintenance for services:', '').trim() : 'Không có mô tả'}</p>
                          {item.empName && <p className="col-span-2"><span className="font-medium text-gray-500">Kỹ thuật viên:</span> {item.empName}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end shrink-0">
              <button onClick={() => setIsHistoryOpen(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition font-medium text-sm">Đóng</button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default CarManagement;
