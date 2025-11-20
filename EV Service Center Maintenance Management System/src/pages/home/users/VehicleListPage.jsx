import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, ChevronRight, ArrowLeft, Loader2, Info, Trash2, MoreVertical } from "lucide-react";

// Đảm bảo đường dẫn import API của bạn là chính xác
import API from '../../../../api';

const VehicleListPage = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeMenu, setActiveMenu] = useState(null);

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
                                        <div className="absolute right-0 top-10 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                onClick={(e) => handleDeleteVehicle(vehicle.vehicleID, e)}
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Xóa xe
                                            </button>
                                            {/* Bạn có thể thêm nút 'Sửa xe' ở đây nếu muốn */}
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
        </div>
    );
};

export default VehicleListPage;