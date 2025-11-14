import React, { useState, useEffect } from 'react';
import api from "../../../../api";
import { statusMapServerToUI } from "../../../utils/statusHelpers";

const StaffAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const res = await api.get("/bookings/all");
                const allBookings = res.data.bookings || [];

                const assignedStatuses = [
                    "Đã xác nhận",
                    "Đang thực hiện",
                    "Chờ khách xác nhận báo giá",
                    "Chờ thanh toán",
                    "Hoàn tất"
                ];

                const allMappedBookings = allBookings.map(b => ({
                    id: b.orderId,
                    customer: b.customerName || "Chưa có tên",
                    vehicle: `${b.vehicleModel || "—"} (${b.vehiclePlateNumber || ""})`,
                    branch: b.serviceCenterName || "—",
                    technician: b.technicianName, 
                    status: statusMapServerToUI[b.status?.trim()?.toLowerCase()] || "Không rõ", 
                    orderDate: new Date(b.orderDate),
                }));

                // Lọc ra những đơn hàng ĐÃ CÓ KTV
                const assignedBookings = allMappedBookings
                    .filter(b =>
                        b.technician || // Nếu API có tên (logic cũ)
                        assignedStatuses.includes(b.status) // HOẶC status hợp lệ (logic mới)
                    )
                    .sort((a, b) => b.orderDate - a.orderDate); // Sắp xếp

                setAssignments(assignedBookings);
            } catch (err) {
                console.error("Lỗi khi tải danh sách phân công:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">Danh sách Đã phân công</h1>

            <div className="bg-white shadow rounded-xl overflow-hidden">
                {loading ? (
                    <p className="p-4 text-gray-500">Đang tải...</p>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="py-3 px-4">Mã đơn</th>
                                <th className="py-3 px-4">Kỹ thuật viên</th>
                                <th className="py-3 px-4">Khách hàng</th>
                                <th className="py-3 px-4">Xe</th>
                                <th className="py-3 px-4">Chi nhánh</th>
                                <th className="py-3 px-4">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        Chưa có đơn hàng nào được phân công.
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((a) => (
                                    <tr key={a.id} className="border-t hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{a.id}</td>
                                        <td className="py-3 px-4 text-blue-600 font-medium">
                                            {a.technician ? a.technician : "Đã phân công"}
                                        </td>
                                        <td className="py-3 px-4">{a.customer}</td>
                                        <td className="py-3 px-4">{a.vehicle}</td>
                                        <td className="py-3 px-4">{a.branch}</td>
                                        <td className="py-3 px-4">
                                            {a.status}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StaffAssignments;