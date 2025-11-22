import React, { useState, useEffect } from "react";
import { statusMapServerToUI } from "../../../utils/statusHelpers";
import Swal from "sweetalert2";
import {
    Calendar,
    Search,
    Filter,
    Plus,
    MoreVertical,
    XCircle,
    CheckCircle,
    Clock,
    AlertCircle
} from "lucide-react";
import { bookingService } from "../../../services/bookingService";

const OrderManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [showModal, setShowModal] = useState(false);

    // State cho form tạo mới (Giản lược)
    const [newOrder, setNewOrder] = useState({
        customerId: "",
        vehicleId: "",
        serviceCenterId: "",
        serviceIds: [],
        appointmentDate: "",
        appointmentTime: "",
        paymentMethod: "CASH"
    });

    // Load dữ liệu
    useEffect(() => {
        fetchBookings();
    }, [filterStatus]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            let data;
            if (filterStatus === "All") {
                const res = await bookingService.getAllBookings();
                data = res.bookings;
            } else {
                data = await bookingService.getBookingsByStatus(filterStatus);
            }
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
            alert("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý Hủy đơn / No-Show
    const handleCancelOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Xác nhận hủy đơn?',
            text: "Trạng thái đơn sẽ chuyển thành 'Đã hủy'.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10B981', // màu xanh emerald
            cancelButtonColor: '#EF4444', // màu đỏ
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                await bookingService.cancelBookingByAdmin(orderId);
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Đã hủy đơn hàng.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchBookings(); // refresh danh sách
            } catch (error) {
                Swal.fire({
                    title: 'Lỗi!',
                    text: error.response?.data?.message || 'Lỗi khi hủy đơn hàng.',
                    icon: 'error',
                });
            }
        }
    };


    const statusFilters = [
        { key: "All", label: "Tất cả" },
        { key: "Pending", label: "Chờ xác nhận" },
        { key: "Confirmed", label: "Đã xác nhận" },
        { key: "In Progress", label: "Đang thực hiện" },
        { key: "Completed", label: "Hoàn tất" },
        { key: "Cancelled", label: "Đã hủy" },
    ];

    // Render Badge trạng thái
    const getStatusBadge = (status) => {
        const viStatus = statusMapServerToUI[status.toLowerCase()] || status; // chuyển sang lowercase nếu server trả về chữ thường

        const styles = {
            "Chờ xác nhận": "bg-yellow-100 text-yellow-800 border-yellow-200",
            "Đã xác nhận": "bg-blue-100 text-blue-800 border-blue-200",
            "Đang thực hiện": "bg-purple-100 text-purple-800 border-purple-200",
            "Chờ khách xác nhận báo giá": "bg-purple-50 text-purple-800 border-purple-200",
            "Đã duyệt": "bg-blue-50 text-blue-800 border-blue-200",
            "Chờ thanh toán": "bg-yellow-50 text-yellow-800 border-yellow-200",
            "Hoàn tất": "bg-green-100 text-green-800 border-green-200",
            "Khách đã xác nhận": "bg-purple-100 text-purple-800 border-purple-200",
            "processing": "bg-gray-100 text-gray-800 border-gray-200",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[viStatus] || "bg-gray-100"}`}>
                {viStatus}
            </span>
        );
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Lịch Hẹn</h1>
                    <p className="text-gray-500 text-sm">Xem và quản lý tất cả các đơn đặt lịch bảo dưỡng</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" /> Tạo Lịch Hẹn Mới
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto">
                    {statusFilters.map(s => (
                        <button
                            key={s.key}
                            onClick={() => setFilterStatus(s.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === s.key
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                    />
                </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Hiển thị {bookings.length} kết quả</span>
            </div>
            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-gray-600 text-sm uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Mã Đơn</th>
                                <th className="px-6 py-4">Khách Hàng & Xe</th>
                                <th className="px-6 py-4">Dịch Vụ</th>
                                <th className="px-6 py-4">Thời Gian</th>
                                <th className="px-6 py-4">Tổng Tiền</th>
                                <th className="px-6 py-4">Trạng Thái</th>
                                <th className="px-6 py-4 text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">Không tìm thấy đơn hàng nào.</td>
                                </tr>
                            ) : (
                                bookings.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{order.orderId}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800">{order.customerName}</span>
                                                <span className="text-xs text-gray-500">{order.vehicleModel} - {order.vehiclePlateNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs truncate text-sm text-gray-600" title={order.serviceType}>
                                                {order.serviceType || "Gói bảo dưỡng"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" /> {order.appointmentDate}
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <Clock className="w-3 h-3 mr-1" /> {order.appointmentTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-emerald-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalCost)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Chỉ hiện nút Xóa khi trạng thái là 'Pending' */}
                                                {order.status === "Pending" && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.orderId)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors tooltip"
                                                        title="Hủy đơn (Khách không đến)"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                )}

                                                {/* Nút Edit (Ví dụ) - Hiện cho tất cả trạng thái trừ Cancelled
                                                {order.status !== "Cancelled" && (
                                                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                )} */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (UI only for now) */}

            </div>

            {/* Modal Tạo Mới (Demo Layout) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-800">Tạo Lịch Hẹn Mới</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Khách Hàng</label>
                                <input type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nhập ID khách hàng..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Xe</label>
                                <input type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nhập ID xe..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trung Tâm Dịch Vụ</label>
                                <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option>Chọn trung tâm...</option>
                                    {/* Cần map danh sách ServiceCenter ở đây */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Hẹn</label>
                                <input type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ Hẹn</label>
                                <input type="time" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all">
                                Xác nhận tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;