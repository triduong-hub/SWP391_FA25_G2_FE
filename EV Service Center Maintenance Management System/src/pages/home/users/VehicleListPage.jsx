import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ArrowLeft, 
  Loader2, 
  Info, 
  Trash2, 
  MoreVertical, 
  FileText, 
  Wrench, 
  X 
} from "lucide-react";

// Đảm bảo đường dẫn import API của bạn là chính xác
import API from '../../../../api';

const VehicleListPage = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeMenu, setActiveMenu] = useState(null);

    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedPlate, setSelectedPlate] = useState("");

    // Hàm tiện ích để lấy Customer ID từ localStorage
    const getCustomerId = () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            return storedUser.userID;
        } catch (e) {
            console.error("Lỗi parse user từ localStorage:", e);
            return null;
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Tải danh sách xe khi component được gắn
    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            const customerId = getCustomerId();

            if (!customerId) {
                setLoading(false);
                setMessage({ type: 'error', text: 'Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.' });
                return;
            }

            try {
                // Gọi API để lấy danh sách xe
                const response = await API.get(`/vehicle/getByCustomerId/${customerId}`);
                const vehicleList = response.data?.data || [];

                if (vehicleList.length > 0) {
                    setVehicles(vehicleList);
                    setMessage({ type: '', text: '' }); // Xóa thông báo nếu có
                } else {
                    setVehicles([]);
                    setMessage({ type: 'info', text: 'Bạn chưa đăng ký chiếc xe nào.' });
                }
            } catch (error) {
                console.error('❌ Lỗi khi tải danh sách xe:', error);
                const errorText = error.response?.data?.message || error.message;
                setMessage({ type: 'error', text: `Không tải được danh sách xe. (${errorText})` });
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []); // Chỉ chạy một lần khi component mount

    // --- HÀM XEM LỊCH SỬ ---
    const handleViewHistory = async (vehicleId, licensePlate, e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
        setActiveMenu(null); // Đóng menu dropdown
        
        setIsHistoryOpen(true);
        setLoadingHistory(true);
        setSelectedPlate(licensePlate);
        setSelectedHistory([]);

        try {
            const response = await API.get(`/maintenances/vehicle/${vehicleId}`);
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

    const handleDeleteVehicle = async (vehicleId, e) => {
        e.stopPropagation();

        // Xác nhận trước khi xóa
        if (!window.confirm("Bạn có chắc chắn muốn xóa chiếc xe này không?")) {
            setActiveMenu(null);
            return;
        }

        try {
            // Gọi API Delete từ Backend
            await API.delete(`/vehicle/delete/${vehicleId}`);

            // Cập nhật lại danh sách xe trên giao diện (loại bỏ xe vừa xóa)
            setVehicles((prev) => prev.filter((v) => v.vehicleID !== vehicleId));

            setMessage({ type: 'success', text: 'Đã xóa xe thành công!' });

            // Tắt thông báo sau 3 giây
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);

        } catch (error) {
            console.error("Lỗi khi xóa xe:", error);
            alert("Xóa thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setActiveMenu(null); // Đóng menu
        }
    };

    // Hàm xử lý khi nhấp vào một chiếc xe
    const handleVehicleClick = (vehicleId) => {
        // Điều hướng đến trang chi tiết xe (VehicleDetail)
        navigate(`/vehicle/${vehicleId}`);
    };

    const toggleMenu = (vehicleId, e) => {
        e.stopPropagation(); // Ngăn không cho click vào thẻ xe
        setActiveMenu(activeMenu === vehicleId ? null : vehicleId);
    };

    // Render giao diện
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">

                {/* Header và Nút Quay Lại */}
                <div className="flex items-center justify-between mb-6">
                    <motion.button
                        onClick={() => navigate(-1)} // Quay lại trang trước (Profile)
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Quay lại Hồ sơ</span>
                    </motion.button>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Xe của tôi
                </h1>

                {/* Trạng thái Loading */}
                {loading && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 size={40} className="animate-spin text-blue-500" />
                        <p className="ml-3 text-lg text-gray-600">Đang tải danh sách xe...</p>
                    </div>
                )}

                {/* Trạng thái Thông báo (Lỗi hoặc Rỗng) */}
                {!loading && message.text && (
                    <div className={`p-4 rounded-xl flex items-center justify-center space-x-3 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        <Info size={20} />
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                {/* Danh sách xe */}
                {!loading && vehicles.length > 0 && (
                    <div className="space-y-4">
                        {vehicles.map((vehicle, index) => (
                            <motion.div
                                key={vehicle.vehicleID}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                onClick={() => handleVehicleClick(vehicle.vehicleID)}
                                className="flex items-center p-4 bg-white shadow-lg rounded-xl border border-gray-100 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                            >
                                {/* Hình ảnh xe */}
                                <img
                                    src={vehicle.imageUrl || vehicle.model?.imageUrl || "https://placehold.co/100x60/E2E8F0/94A3B8?text=VINFAST"}
                                    alt={vehicle.model?.modelName || 'Hình ảnh xe'}
                                    className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg bg-gray-200"
                                />

                                {/* Thông tin xe */}
                                <div className="flex-1 mx-4">
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {vehicle.model?.modelName || 'Mẫu xe không rõ'}
                                    </h3>
                                    <p className="text-gray-600 font-medium">{vehicle.licensePlate}</p>
                                    <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${vehicle.status === false // Giả định status=false là Đang Bảo Dưỡng
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {vehicle.status === false ? 'Đang Bảo Dưỡng' : 'Sẵn Sàng'}
                                    </span>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => toggleMenu(vehicle.vehicleID, e)}
                                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === vehicle.vehicleID && (
                                        <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            
                                            {/* --- NÚT LỊCH SỬ BẢO DƯỠNG --- */}
                                            <button
                                                onClick={(e) => handleViewHistory(vehicle.vehicleID, vehicle.licensePlate, e)}
                                                className="flex items-center w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors text-left border-b border-gray-100"
                                            >
                                                <FileText size={16} className="mr-2" />
                                                Lịch sử bảo dưỡng
                                            </button>

                                            {/* Nút Xóa */}
                                            <button
                                                onClick={(e) => handleDeleteVehicle(vehicle.vehicleID, e)}
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Xóa xe
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Mũi tên điều hướng (Chỉ hiện khi không mở menu) */}
                                {activeMenu !== vehicle.vehicleID && (
                                    <div className="text-gray-300 ml-2">
                                        <ChevronRight size={24} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
            {/* --- MODAL LỊCH SỬ BẢO DƯỠNG --- */}
            <AnimatePresence>
                {isHistoryOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
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
                            <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                {loadingHistory ? (
                                    <div className="flex justify-center items-center py-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : selectedHistory.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                        <FileText className="w-12 h-12 mb-2 opacity-20" />
                                        <p>Xe chưa có lịch sử bảo dưỡng nào.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedHistory.map((item) => (
                                            <div key={item.maintenanceID} className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                            item.status === 'Completed' ? 'bg-green-100 text-green-700' :
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

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                                                    <p><span className="font-medium text-gray-500">Ngày bắt đầu:</span> {new Date(item.startTime).toLocaleDateString('vi-VN')}</p>
                                                    <p><span className="font-medium text-gray-500">Ngày kết thúc:</span> {item.endTime ? new Date(item.endTime).toLocaleDateString('vi-VN') : '---'}</p>
                                                    <p className="col-span-1 sm:col-span-2"><span className="font-medium text-gray-500">Mô tả:</span> {item.description}</p>
                                                    {item.empName && <p className="col-span-1 sm:col-span-2"><span className="font-medium text-gray-500">Kỹ thuật viên:</span> {item.empName}</p>}
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
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VehicleListPage;