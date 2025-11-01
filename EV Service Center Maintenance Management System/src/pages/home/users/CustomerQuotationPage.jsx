import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api";
import { ArrowLeft, ClipboardList, Wrench, DollarSign, CheckCircle } from "lucide-react";

export default function CustomerQuotationDetailPage() {
    const { orderId } = useParams();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                console.log(" Gọi API cho customer với orderId:", orderId);
                const res = await api.get(`/quotations/order/${orderId}`);
                const q = res.data.data;

                console.log(" Dữ liệu trả về từ API:", q); // <- thêm dòng này
                console.log(" status trả về:", q.status);   // <- thêm dòng này   

                const formatted = {
                    quotationId: q.quotationID,
                    customerName: q.customerName,
                    technicianName: q.technicianName,
                    licensePlate: q.vehicleLicensePlate,
                    vehicleModel: q.vehicleModel,
                    totalAmount: q.totalAmount,
                    status:
                        q.status === "PENDING" || q.status === "AWAITING_APPROVAL" || q.status === "AWAITING_CUSTOMER_APPROVAL"
                            ? "Chờ khách duyệt"
                            : q.status === "APPROVED"
                                ? "Đã xác nhận"
                                : q.status,


                    checklist: q.checklistItemsStatus || [],
                    parts: q.componentsUsed?.map((item) => ({
                        id: item.maintenanceComponentID,   // ✅ dùng ID thật để PUT đúng
                        name: item.componentName,
                        quantity: item.quantity,
                        price: item.componentPrice,
                        maintenanceId: item.maintenanceId,
                    })) || [],
                };


                setQuotation(formatted);
            } catch (err) {
                console.error(" Lỗi khi tải báo giá:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotation();
    }, [orderId]);


    // ✅ Tự động cập nhật tổng tiền khi khách thay đổi số lượng linh kiện
    useEffect(() => {
        if (quotation?.parts) {
            const total = quotation.parts.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
            );
            setQuotation((prev) => ({ ...prev, totalAmount: total }));
        }
    }, [quotation?.parts]);


    const handleConfirmQuotation = async () => {
        setConfirming(true);
        setMessage("");
        try {
            const res = await api.put(
                `/quotations/${quotation.quotationId}/confirm`,
                null,
                { params: { approved: true } }
            );
            console.log("Response confirm/reject:", res.data);
            setMessage("✅ Xác nhận báo giá thành công!");
            setQuotation((prev) => ({ ...prev, status: "Hoàn tất" }));
        } catch (err) {
            console.error(err);
            setMessage("❌ Lỗi khi xác nhận báo giá!");
        } finally {
            setConfirming(false);
        }
    };


    const handleRejectQuotation = async () => {
        setConfirming(true);
        setMessage("");
        try {
            const res = await api.put(
                `/quotations/${quotation.quotationId}/confirm`,
                null,
                { params: { approved: false } }
            );
            console.log("Response confirm/reject:", res.data);
            setMessage(" Bạn đã từ chối báo giá!");
            setQuotation((prev) => ({ ...prev, status: "Từ chối" }));
        } catch (err) {
            console.error(err);
            setMessage(" Lỗi khi từ chối báo giá!");
        } finally {
            setConfirming(false);
        }
    };


    const formatCurrency = (num) =>
        num?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    if (loading)
        return <div className="p-8 text-gray-600 text-lg">⏳ Đang tải dữ liệu...</div>;

    if (!quotation)
        return (
            <div className="p-8 text-red-600 font-semibold">
                Không tìm thấy báo giá cho đơn hàng #{orderId}
            </div>
        );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Báo giá đơn hàng #{orderId}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Xem chi tiết báo giá và tình trạng đơn hàng của bạn
                    </p>
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
                </button>
            </div>

            {/* Thông tin khách hàng */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-3">📋 Thông tin đơn hàng</h2>
                <div className="grid sm:grid-cols-2 gap-y-2 text-gray-700">
                    <p>
                        <strong>Khách hàng:</strong> {quotation.customerName || "N/A"}
                    </p>
                    <p>
                        <strong>Kỹ thuật viên:</strong> {quotation.technicianName || "N/A"}
                    </p>
                    <p>
                        <strong>Biển số xe:</strong> {quotation.licensePlate || "N/A"}
                    </p>
                    <p>
                        <strong>Model xe:</strong> {quotation.vehicleModel || "N/A"}
                    </p>
                </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                <div className="flex items-center mb-3">
                    <ClipboardList className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold">Tình trạng kiểm tra</h2>
                </div>

                {quotation.checklist?.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {quotation.checklist.map((c) => {
                            const statusLabel =
                                c.status?.toLowerCase() === "pass"
                                    ? "Đạt"
                                    : c.status?.toLowerCase() === "fail"
                                        ? "Không đạt"
                                        : c.status || "Chưa kiểm tra";

                            const statusStyle =
                                c.status?.toLowerCase() === "pass"
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : c.status?.toLowerCase() === "fail"
                                        ? "bg-red-100 text-red-700 border border-red-300"
                                        : "bg-gray-100 text-gray-600 border border-gray-300";

                            return (
                                <li
                                    key={c.checkListId}
                                    className="py-2 flex justify-between items-center transition hover:bg-gray-50 rounded-lg px-3"
                                >
                                    <span className="font-medium text-gray-800">{c.checkListName}</span>
                                    <span
                                        className={`px-4 py-1 rounded-full text-sm font-semibold ${statusStyle}`}
                                    >
                                        {statusLabel}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">Không có mục kiểm tra</p>
                )}
            </div>

            {/* Linh kiện */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                <div className="flex items-center mb-3">
                    <Wrench className="w-5 h-5 text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold">Chi tiết linh kiện</h2>
                </div>

                {quotation.parts?.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border p-2 text-left">Tên linh kiện</th>
                                <th className="border p-2 text-center">Số lượng</th>
                                <th className="border p-2 text-right">Đơn giá</th>
                                <th className="border p-2 text-right">Thành tiền</th>

                            </tr>

                        </thead>
                        <tbody>
                            {quotation.parts.map((p) => (
                                <tr key={p.id} className="border-b">
                                    <td className="border p-2">{p.name}</td>

                                    {/* Chỉ hiển thị số lượng, không cho nhập */}
                                    <td className="border p-2 text-center">{p.quantity}</td>

                                    <td className="border p-2 text-right">
                                        {formatCurrency(p.price)}
                                    </td>

                                    <td className="border p-2 text-right">
                                        {formatCurrency(p.price * p.quantity)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                ) : (
                    <p className="text-gray-500 italic">Không có linh kiện</p>
                )}
            </div>

            {/* Tổng tiền + trạng thái */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600">Trạng thái đơn hàng:</p>
                        <p
                            className={`font-semibold ${quotation.status === "Đã xác nhận"
                                ? "text-green-600"
                                : quotation.status.includes("Chờ")
                                    ? "text-yellow-600"
                                    : "text-gray-700"
                                }`}
                        >
                            {quotation.status || "Chưa xác định"}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-gray-600">Tổng cộng:</p>
                        <p className="text-2xl font-bold text-green-700 flex items-center justify-end">
                            <DollarSign className="w-5 h-5 mr-1" />
                            {formatCurrency(quotation.totalAmount)}
                        </p>
                    </div>
                </div>

                {/* 🔘 Nút xác nhận và từ chối báo giá */}
                {quotation.status === "Chờ khách duyệt" && (
                    <div className="mt-6 text-right flex gap-3 justify-end">
                        {/* Nút từ chối */}
                        <button
                            onClick={handleRejectQuotation}
                            disabled={confirming}
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
                        >
                            Từ chối
                        </button>

                        {/* Nút xác nhận */}
                        <button
                            onClick={handleConfirmQuotation}
                            disabled={confirming}
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition"
                        >
                            {confirming ? "Đang xác nhận..." : "Xác nhận"}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
