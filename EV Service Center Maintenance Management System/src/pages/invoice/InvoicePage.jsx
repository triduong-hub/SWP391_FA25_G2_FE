import React, { useEffect, useState } from "react";
import { Car, ArrowLeft } from "lucide-react";
import api from "../../../api"; //  Đường dẫn axios config
import { useParams } from "react-router-dom";

const InvoicePage = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { orderId } = useParams();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await api.get(`/invoices/getby/order/${orderId}`);
                console.log("API response:", res.data);
                setInvoiceData(res.data.data); //  object hóa đơn
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu hóa đơn:", err);
                setError("Không thể tải dữ liệu hóa đơn.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchInvoice();
    }, [orderId]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg">Đang tải dữ liệu hóa đơn...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );

    if (!invoiceData)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg">Không có dữ liệu hóa đơn để hiển thị.</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-300 p-10">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2.5 rounded-xl shadow-md">
                            <Car className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl text-gray-800">EV Care Pro</h1>
                            <p className="text-sm text-gray-500 -mt-1">
                                Bảo dưỡng xe điện chuyên nghiệp
                            </p>
                        </div>
                    </div>

                    <div className="text-right text-sm text-gray-600">
                        <p><span className="font-semibold">Mã số thuế:</span> 079205000519</p>
                        <p><span className="font-semibold">Địa chỉ:</span> 1084 Nguyễn Duy Trinh P.Long Trường TP.HCM</p>
                        <p><span className="font-semibold">Hotline:</span> 0906791084</p>
                        <p><span className="font-semibold">Email:</span> dinhtri11012005@gmail.com</p>
                        <p><span className="font-semibold">Website:</span> www.evcare.vn</p>
                    </div>
                </div>

                {/* Tiêu đề */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 uppercase">
                        Hóa Đơn Thanh Toán
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Mã hóa đơn: #{invoiceData.invoiceID} • Mã bảo dưỡng: #{invoiceData.maintenanceId}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Ngày lập: {new Date(invoiceData.issuedDate).toLocaleDateString("vi-VN")}
                    </p>
                </div>

                {/* Thông tin khách hàng & xe */}
                <div className="grid grid-cols-2 gap-6 mb-8 text-gray-700">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Khách hàng</h3>
                        <p>{invoiceData.customerName}</p>
                        <p>📞 {invoiceData.customerPhone}</p>
                        <p>✉️ {invoiceData.customerEmail}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Thông tin xe</h3>
                        <p>Mẫu xe: {invoiceData.vehicleModel}</p>
                        <p>Biển số: {invoiceData.vehicleLicensePlate}</p>
                        <p>
                            Ngày nhận:{" "}
                            {invoiceData.startTime
                                ? new Date(invoiceData.startTime).toLocaleString("vi-VN")
                                : "—"}
                        </p>
                        <p>
                            Ngày trả:{" "}
                            {invoiceData.endTime
                                ? new Date(invoiceData.endTime).toLocaleString("vi-VN")
                                : "Chưa trả"}
                        </p>
                    </div>
                </div>

                {/* Chi tiết hóa đơn */}
                <table className="min-w-full border border-gray-300 text-sm text-gray-700 rounded-lg overflow-hidden mb-6">
                    <thead className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                        <tr>
                            <th className="py-2 px-3 text-left">#</th>
                            <th className="py-2 px-3 text-left">Hạng mục</th>
                            <th className="py-2 px-3 text-left">Mô tả</th>
                            <th className="py-2 px-3 text-center">SL</th>
                            <th className="py-2 px-3 text-center">Đơn giá (VND)</th>
                            <th className="py-2 px-3 text-right">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData.invoiceDetails?.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="py-2 px-3">{index + 1}</td>
                                <td className="py-2 px-3 font-medium">{item.itemName}</td>
                                <td className="py-2 px-3 text-gray-500">{item.description}</td>
                                <td className="py-2 px-3 text-center">{item.quantity}</td>
                                <td className="py-2 px-3 text-center">{item.unitPrice.toLocaleString()}</td>
                                <td className="py-2 px-3 text-right font-semibold">{item.subTotal.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Tổng kết */}
                <div className="text-right text-gray-700 space-y-1">
                    <p>
                        <span className="font-medium">Tổng tiền hàng:</span>{" "}
                        {invoiceData.totalAmount?.toLocaleString()} VND
                    </p>
                    <p>
                        <span className="font-medium">Giảm giá:</span> 0 VND
                    </p>
                    <p>
                        <span className="font-medium">Chi phí khác:</span> 0 VND
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                        Tổng thanh toán: {invoiceData.totalAmount?.toLocaleString()} VND
                    </p>
                    <p className="text-sm text-gray-500">
                        (Đã bao gồm tất cả chi phí và thuế)
                    </p>
                    <p className="mt-2">
                        <span className="font-medium">Hình thức thanh toán:</span>{" "}
                        {invoiceData.paymentMethod}
                    </p>
                    <p>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${invoiceData.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {invoiceData.status === "PAID"
                                ? "ĐÃ THANH TOÁN"
                                : "CHƯA THANH TOÁN"}
                        </span>
                    </p>
                </div>

                {/* Chữ ký */}
                <div className="mt-10 flex justify-between items-start text-sm text-gray-600">
                    <div>
                        <p className="italic">
                            Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của{" "}
                            <span className="font-semibold text-gray-800">EV Care Pro</span>.
                        </p>
                        <p className="mt-1">
                            Mọi thắc mắc xin liên hệ:{" "}
                            <span className="text-blue-600">support@evcare.vn</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Người lập hóa đơn</p>
                        <div className="h-16"></div>
                        <p className="italic text-gray-500">(Ký và ghi rõ họ tên)</p>
                        <p className="font-medium mt-1">Dương Đình Trí</p>
                    </div>
                </div>

                {/* Nút quay lại */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
