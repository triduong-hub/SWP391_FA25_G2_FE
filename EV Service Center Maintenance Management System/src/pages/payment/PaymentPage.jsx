import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api";
import { Loader2, ArrowLeft } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';


const PaymentPage = () => {
    const { orderId } = useParams();
    const [loading, setLoading] = useState(true);
    const [qrUrl, setQrUrl] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaymentQR = async () => {
            try {
                let invoiceId;
                let totalAmount;
                let existing = null;

                // 🔹 1️⃣ Lấy maintenanceId thật dựa theo orderId
                let maintenanceId = null;
                try {
                    const res = await API.get(`/maintenances/${orderId}/maintenance`);
                    console.log("📦 Phản hồi maintenance:", res.data);

                    maintenanceId =
                        res.data?.maintenanceId || // ✅ đúng key backend trả
                        res.data?.maintenance_id ||
                        res.data?.id ||
                        res.data?.data?.maintenanceId;

                    if (!maintenanceId)
                        throw new Error("Không tìm thấy maintenanceId từ phản hồi backend.");

                    console.log("🧩 Đã tìm thấy maintenanceId:", maintenanceId, "từ orderId:", orderId);
                } catch (err) {
                    console.error("❌ Lỗi khi lấy maintenanceId:", err);
                    setError("Không thể tìm thấy phiên bảo dưỡng để thanh toán.");
                    setLoading(false);
                    return;
                }

                // 🔹 2️⃣ Tìm hóa đơn đã tồn tại theo maintenanceId
                try {
                    const res = await API.get("/invoices/getAll");
                    console.log("📦 Dữ liệu hóa đơn trả về:", res.data);
                    const allInvoices = res.data?.data || []; // ✅ dữ liệu thật nằm trong data[]
                    existing = allInvoices.find(
                        (inv) => Number(inv.maintenanceId) === Number(maintenanceId)
                    );
                    if (existing)
                        console.log("🔹 Đã tìm thấy hóa đơn theo maintenanceId:", existing);
                } catch (err) {
                    console.warn("Không thể lấy danh sách hóa đơn:", err);
                }

                // 🔹 3️⃣ Nếu chưa có hóa đơn thì tạo mới
                if (!existing) {
                    // tạo hóa đơn mới
                    const invoiceRes = await API.post("/invoices/create", {
                        maintenanceId: Number(maintenanceId),
                    });
                    console.log("🧾 Hóa đơn mới:", invoiceRes.data);

                    invoiceId =
                        invoiceRes.data?.invoiceId ||
                        invoiceRes.data?.id ||
                        invoiceRes.data?.data?.invoiceId;
                    totalAmount =
                        invoiceRes.data?.totalAmount ||
                        invoiceRes.data?.data?.totalAmount ||
                        0;
                } else {
                    // dùng dữ liệu từ existing nếu hóa đơn đã có
                    invoiceId = existing.invoiceID || existing.invoiceId || existing.id;
                    totalAmount = existing.totalAmount || 0;
                }


                // 🔹 4️⃣ Gọi PayOS để lấy QR
                if (!invoiceId) throw new Error("Không tìm thấy invoiceId để thanh toán");

                console.log("📦 Thanh toán cho invoiceId:", invoiceId);

                const paymentRes = await API.post("/payment/create", {
                    invoiceId,
                    amount: totalAmount,
                    method: "PAYOS",
                });

                let qr;

                // Nếu server trả thẳng URL string
                if (typeof paymentRes.data === "string") {
                    qr = paymentRes.data;
                } else {
                    qr =
                        paymentRes.data?.qrCodeUrl ||
                        paymentRes.data?.qrUrl ||
                        paymentRes.data?.checkoutUrl ||
                        paymentRes.data?.data?.qrCodeUrl ||
                        paymentRes.data?.data?.qrUrl ||
                        paymentRes.data?.data?.checkoutUrl;
                }

                if (!qr) {
                    console.error("📛 Payload thanh toán trả về không có QR:", paymentRes.data);
                    throw new Error("Không có mã QR trả về từ server.");
                }
                console.log("💳 invoiceId:", invoiceId, "totalAmount:", totalAmount);
                console.log("📦 QR URL nhận được:", qr);

                if (qr && qr.startsWith("https://pay.payos.vn")) {
                    setQrUrl(qr);
                } else if (qr && typeof qr === "string") {
                    // Nếu backend chỉ trả lại ID, tự ghép domain PayOS
                    setQrUrl(`https://pay.payos.vn/web/${qr}`);
                } else {
                    console.error("⚠️ URL QR không hợp lệ:", qr);
                    setError("Liên kết thanh toán không hợp lệ, vui lòng thử lại.");
                }

            } catch (err) {
                console.error("❌ Lỗi khi tạo thanh toán:", err.response?.data || err);
                setError(
                    err.response?.data?.error ||
                    "Không thể khởi tạo thanh toán. Vui lòng thử lại sau."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentQR();
    }, [orderId]);

    // 🌀 Loading state
    if (loading)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
                <p className="mt-3 text-gray-600">Đang khởi tạo thanh toán...</p>
            </div>
        );

    // ⚠️ Error state
    if (error)
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-6">
                <p className="text-red-500 font-semibold mb-3">{error}</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Quay lại trang chủ
                </button>
            </div>
        );

    // ✅ Hiển thị QR
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md bg-white shadow-lg rounded-2xl p-8 text-center space-y-5">
                <h1 className="text-2xl font-bold text-gray-800">
                    Thanh toán đơn #{orderId}
                </h1>
                <p className="text-gray-500">
                    Quét mã QR bên dưới để hoàn tất thanh toán
                </p>
                {/* ✅ Kiểm tra URL QR thực tế */}
                {console.log("✅ URL QR thực tế đang render:", qrUrl)}

                {/* {qrUrl && (
                    <QRCodeSVG
                        value={qrUrl}
                        size={288}
                        level="H"
                        includeMargin={true}
                        className="mx-auto rounded-xl border shadow"
                    />
                )} */}

                {qrUrl && (
                    <>
                        <QRCodeSVG
                            value={qrUrl}
                            size={288}
                            level="H"
                            includeMargin={true}
                            className="mx-auto rounded-xl border shadow"
                        />
                        <a
                            href={qrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-3 text-blue-600 underline"
                        >
                            Mở liên kết thanh toán trực tiếp
                        </a>
                    </>
                )}



                <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center mx-auto gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
