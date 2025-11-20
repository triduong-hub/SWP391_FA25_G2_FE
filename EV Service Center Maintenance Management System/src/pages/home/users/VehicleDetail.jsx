import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Tag, Zap, Save, X, Edit3, ArrowLeft, Edit2, RotateCw } from "lucide-react";
import API from '../../../../api';

const VehicleDetail = () => {
    const navigate = useNavigate();
    const { vehicleId } = useParams();

    const [vehicle, setVehicle] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [reloadKey, setReloadKey] = useState(0);

    const getCustomerId = () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            return storedUser.userID;
        } catch (e) {
            return null;
        }
    };

    const isUnderMaintenance = vehicle?.status === false;

    const fetchVehicle = async () => {
        setLoading(true);

        // 1. Lấy Customer ID 
        const customerId = getCustomerId();
        if (!customerId) {
            setVehicle(null);
            setLoading(false);
            setMessage({ type: 'error', text: 'Không tìm thấy ID khách hàng (Chưa đăng nhập?).' });
            return;
        }

        try {
            const response = await API.get(`/vehicle/getByCustomerId/${customerId}`);

            const allVehicles = response.data?.data || [];

            // 2. Lọc mảng để tìm xe có vehicleId mong muốn
            const vehicleData = allVehicles.find(
                item => String(item.vehicleID) === String(vehicleId)
            );

            if (!vehicleData || !vehicleData.vehicleID) {
                throw new Error(`Không tìm thấy xe có ID ${vehicleId} trong danh sách của khách hàng ${customerId}.`);
            }

            setVehicle(vehicleData);
            setFormData({
                licensePlate: vehicleData.licensePlate || '',
                vin: vehicleData.vin || '',
                customerNote: vehicleData.customerNote || '',
            });
            setMessage({ type: 'success', text: 'Tải dữ liệu thành công.' });
        } catch (error) {
            console.error('Lỗi khi tải chi tiết xe (Sử dụng API List):', error);
            setVehicle(null);
            const errorText = error.response?.data?.message || error.message;
            setMessage({ type: 'error', text: `Không tải được chi tiết xe. (${errorText})` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicle();
    }, [vehicleId, reloadKey]);

    // 2. Hàm xử lý cập nhật
    const handleUpdate = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        if (!vehicle?.vehicleID) {
            setSaving(false);
            setMessage({ type: 'error', text: 'Không tìm thấy ID xe.' });
            return;
        }

        // 1. Chuẩn bị Payload (chỉ gửi những trường thay đổi)
        const finalPayload = {
            // Trường bắt buộc từ API update
            customerId: parseInt(vehicle.customerID, 10),
            modelID: parseInt(vehicle.model.modelID, 10),
            mileage: parseInt(vehicle.mileage, 10),
            lastMaintenanceMileage: parseInt(vehicle.lastMaintenanceMileage, 10),
            type: vehicle.type,
            lastMaintenanceDate: vehicle.lastMaintenanceDate,
            status: vehicle.status,
            licensePlate: formData.licensePlate,
            vin: formData.vin,
            // customerNote: formData.customerNote, 
        };

        // API UPDATE VEHICLE: /vehicle/update/{vehicleID}
        const endpoint = `/vehicle/update/${vehicle.vehicleID}`;

        try {
            await API.patch(endpoint, finalPayload);
            setSaving(false);
            setEditMode(false);
            setMessage({ type: 'success', text: `Cập nhật thành công!` });
            setVehicle({ ...vehicle, ...finalPayload, customerNote: formData.customerNote });

        } catch (error) {
            setSaving(false);
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định khi cập nhật xe.';
            setMessage({
                type: 'error',
                text: `Cập nhật thất bại: ${errorMessage}`,
            });
        }
    };

    // 3. Hàm xử lý giao diện
    const startEdit = () => {
        if (isUnderMaintenance) {
            setMessage({ type: 'warning', text: 'Xe đang bảo dưỡng/ngừng hoạt động, không thể chỉnh sửa thông tin.' });
            return;
        }
        // Đảm bảo formData là bản sao sạch của dữ liệu xe hiện tại
        setFormData({
            licensePlate: vehicle.licensePlate || '',
            vin: vehicle.vin || '',
            customerNote: vehicle.customerNote || '',
        });
        setMessage({ type: '', text: '' });
        setEditMode(true);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setMessage({ type: '', text: '' });
    };

    // Chỉ cần kiểm tra biển số và VIN không được rỗng
    const isFormValid = formData.licensePlate?.trim() && formData.vin?.trim();


    // Render chi tiết thông tin
    const renderDetail = (Icon, label, key, color, type = 'text', readOnly = false) => (
        <div className="flex items-start gap-3">
            <div className={`bg-${color}-100 p-3 rounded-xl text-${color}-600 shrink-0`}>
                <Icon size={20} />
            </div>
            <div className="w-full">
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                {(editMode && !readOnly && !isUnderMaintenance) ? (
                    <input
                        type={type}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base font-semibold text-gray-800 resize-none"
                        required={key === 'licensePlate' || key === 'vin'}
                    />
                ) : (
                    <p className="text-base font-semibold text-gray-800 whitespace-pre-wrap">
                        {vehicle[key] || "Chưa có thông tin"}
                    </p>
                )}
            </div>
        </div>
    );

    // Render chi tiết ghi chú (textarea)
    const renderNoteDetail = (Icon, label, key, color, readOnly = false) => (
        <div className="flex items-start gap-3">
            <div className={`bg-${color}-100 p-3 rounded-xl text-${color}-600 shrink-0`}>
                <Icon size={20} />
            </div>
            <div className="w-full">
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                {(editMode && !readOnly && !isUnderMaintenance) ? (
                    <textarea
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base font-semibold text-gray-800 resize-none"
                        rows={3}
                    />
                ) : (
                    <p className="text-base font-semibold text-gray-800 whitespace-pre-wrap">
                        {vehicle[key] || "Chưa có ghi chú"}
                    </p>
                )}
            </div>
        </div>
    );

    // Hiển thị loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-500 animate-pulse text-lg">
                    Đang tải chi tiết xe (ID: {vehicleId})...
                </p>
            </div>
        );
    }

    // KIỂM TRA TRƯỜNG HỢP TẢI THẤT BẠI (loading=false và vehicle=null)
    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi Tải Dữ Liệu</h2>
                <p className="text-gray-600 mb-8">
                    Không thể tìm thấy thông tin xe với ID: **{vehicleId}**
                    hoặc không thể lấy được danh sách xe từ API.
                    Vui lòng thử lại.
                </p>
                <p className="text-red-500 italic text-sm mb-4">{message.text}</p>
                <button
                    onClick={() => setReloadKey(prev => prev + 1)} // Nút Thử lại
                    className="bg-red-600 text-white font-medium px-6 py-2.5 rounded-xl shadow hover:bg-red-700 transition flex items-center space-x-2"
                >
                    <RotateCw size={20} />
                    <span>Thử lại</span>
                </button>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4 sm:px-6 py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
            >
                {/* Header and Vehicle Image */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 sm:p-8 text-white relative">
                    <button
                        onClick={() => navigate(-1)} // Quay lại trang trước
                        className="absolute top-4 left-4 text-white/90 hover:text-white transition-colors flex items-center space-x-1"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm">Quay lại</span>
                    </button>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
                        <motion.img
                            src={vehicle.imageUrl || vehicle.model?.imageUrl || "https://placehold.co/150x80/29324C/FFFFFF?text=VINFAST"}
                            alt={`${vehicle.model?.modelName || "Xe"} - ${vehicle.licensePlate}`}
                            className="w-full sm:w-60 h-auto rounded-xl object-cover shadow-lg border border-white/30"
                        />

                        <div className="text-left w-full">
                            <h1 className="text-3xl font-bold tracking-tight mb-1">
                                {vehicle.model?.modelName || "Mẫu xe"}
                            </h1>
                            <p className="text-lg opacity-90 mb-3">{vehicle.licensePlate}</p>

                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isUnderMaintenance
                                    ? 'bg-yellow-400 text-yellow-900'
                                    : 'bg-green-400 text-green-900'
                                    }`}>
                                    {isUnderMaintenance ? 'Đang Bảo Dưỡng' : 'Sẵn Sàng'}
                                </span>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!editMode && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={startEdit}
                                disabled={isUnderMaintenance}
                                className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition ${isUnderMaintenance
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-white text-blue-600 hover:bg-indigo-50'
                                    }`}
                                aria-label="Chỉnh sửa thông tin xe"
                            >
                                <Edit3 size={20} />
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 bg-white">
                    {/* Message Box */}
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : message.type === 'warning'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Thông tin cơ bản</h3>
                            {renderDetail(Tag, 'Biển số xe', 'licensePlate', 'blue')}
                            {renderDetail(Zap, 'Mã VIN', 'vin', 'indigo')}
                            <div className="flex items-start gap-3">
                                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 shrink-0">
                                    <Car size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Loại xe</p>
                                    <p className="text-base font-semibold text-gray-800">{vehicle.type}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-orange-100 p-3 rounded-xl text-orange-600 shrink-0">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Số km</p>
                                    <p className="text-base font-semibold text-gray-800">{vehicle.mileage} km</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Dịch vụ</h3>
                            {/* {renderNoteDetail(Edit2, 'Ghi chú của khách hàng', 'customerNote', 'purple')} */}

                            <div className="text-sm p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="font-semibold text-gray-700 mb-2">Trạng thái xe:</p>
                                <p className={`font-bold ${isUnderMaintenance ? 'text-yellow-700' : 'text-green-700'}`}>
                                    {isUnderMaintenance
                                        ? '🔒 Đang bảo dưỡng, không thể chỉnh sửa.'
                                        : 'Mở, có thể chỉnh sửa.'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Khách hàng: {vehicle.customerName} (ID: {vehicle.customerID})
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="mt-10 flex justify-center space-x-4">
                        {editMode ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleUpdate}
                                    disabled={saving || !isFormValid || isUnderMaintenance}
                                    className={`flex items-center space-x-2 font-medium px-6 py-2.5 rounded-xl shadow transition ${(isFormValid && !saving && !isUnderMaintenance)
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {saving ? 'Đang lưu...' : (
                                        <>
                                            <Save size={20} />
                                            <span>Lưu thay đổi</span>
                                        </>
                                    )}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={cancelEdit}
                                    className="flex items-center space-x-2 bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-xl shadow hover:bg-gray-300 transition"
                                    disabled={saving}
                                >
                                    <X size={20} />
                                    <span>Hủy</span>
                                </motion.button>
                            </>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(-1)} // Quay lại trang trước
                                className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
                            >
                                Quay lại danh sách xe
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VehicleDetail;