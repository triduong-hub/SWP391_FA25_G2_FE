import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api"; //  import api.js có sẵn
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";


export default function QuotationPage() {
    const { jobId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [checklist, setChecklist] = useState([]);
    const [components, setComponents] = useState([]);
    const [parts, setParts] = useState([{ componentID: "", quantity: 1, price: 0 }]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [partsSent, setPartsSent] = useState(false);
    const [isSendingParts, setIsSendingParts] = useState(false);
    const [message, setMessage] = useState("");      // Nội dung thông báo
    const [messageType, setMessageType] = useState(""); // "error" | "success"
    const [quotationSent, setQuotationSent] = useState(false);
    const [checklistMessage, setChecklistMessage] = useState("");
    const [checklistMessageType, setChecklistMessageType] = useState(""); // "success" | "error"
    const [checklistSent, setChecklistSent] = useState(false);
    const navigate = useNavigate(); // ✅ thêm dòng này



    //  Gọi API khi load trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                //  1. Lấy thông tin bảo trì + khách hàng
                const jobRes = await api.get(`/maintenances/${jobId}`);
                console.log("📦 Dữ liệu maintenance:", jobRes.data);

                const data = jobRes.data.data || {};

                setCustomer({
                    customerName: data.customerName || "Không rõ",
                    technicianName: data.empName || "Không rõ",
                    vehicleModel: data.model || "Không rõ", //  map Model → vehicleModel
                    licensePlate: data.licensePlate || "Không rõ",
                });

                //  2. Lấy checklist
                const checklistRes = await api.get("/checklists");
                console.log("📋 Checklist:", checklistRes.data);
                setChecklist(checklistRes.data.data || []);


                //  3. Lấy linh kiện
                const compRes = await api.get("/components/getAll");
                const compData = compRes.data?.data || compRes.data || []; // ⚙️ fallback nếu API không bọc trong .data
                console.log("⚙️ Linh kiện (đã xử lý):", compData);
                setComponents(compData);

                setLoading(false);
            } catch (err) {
                console.error("❌ Lỗi khi tải dữ liệu:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [jobId]);


    //  Tính tổng tiền
    useEffect(() => {
        const totalPrice = parts.reduce((sum, p) => sum + p.quantity * p.price, 0);
        setTotal(totalPrice);
    }, [parts]);

    //  Xử lý chọn linh kiện
    const handlePartChange = (index, field, value) => {
        const updated = [...parts];
        updated[index][field] = value;

        // Nếu chọn linh kiện → tự động lấy giá
        if (field === "componentID") {
            const found = components.find((c) => c.componentID === parseInt(value));
            updated[index].price = found ? found.price : 0;
        }


        setParts(updated);
    };

    const handleAddPart = () => {
        setParts([...parts, { componentID: "", quantity: 1, price: 0 }]);
    };

    console.log("📦 Parts chuẩn bị gửi:", parts);

    //  Hàm gửi linh kiện trước khi báo giá
    const handleSendComponents = async () => {
        if (parts.length === 0 || !parts.some(p => p.componentID)) {
            setMessage(" Vui lòng chọn ít nhất một linh kiện!");
            setMessageType("error");
            return;
        }

        try {
            setIsSendingParts(true);
            await Promise.all(
                parts.map((p) =>
                    api.post(`/maintenances/${jobId}/components`, {
                        componentId: Number(p.componentID),
                        quantity: Number(p.quantity),
                        price: Number(p.price),
                    })
                )
            );

            setMessage(" Gửi linh kiện thành công!");
            setMessageType("success");
            setPartsSent(true);
        } catch (err) {
            console.error(err);
            setMessage(" Gửi linh kiện thất bại, vui lòng thử lại!");
            setMessageType("error");
        } finally {
            setIsSendingParts(false);
        }
    };


    const handleSaveChecklist = async (maintenanceID, checklistItems) => {
        if (!checklistItems || checklistItems.length === 0) {
            setChecklistMessage(" Chưa có thông tin checklist để lưu!");
            setChecklistMessageType("error");
            return;
        }

        try {
            for (const item of checklistItems) {
                const singlePayload = {
                    maintenanceId: Number(maintenanceID),
                    checkListId: item.checkListId,
                    status: item.status || "none",
                };
                await api.post(`/maintenances/${jobId}/checklist-items`, singlePayload);
            }

            setChecklistMessage(" Đã lưu checklist thành công!");
            setChecklistMessageType("success");
            setChecklistSent(true); // ✅ khóa nút sau khi lưu
        } catch (err) {
            console.error("❌ Lỗi khi lưu checklist:", err);
            setChecklistMessage(" Lưu checklist thất bại, vui lòng thử lại!");
            setChecklistMessageType("error");
        }
    };





    const handleSubmit = async () => {
        if (!checklistSent || !partsSent) {
            Swal.fire({
                toast: true,
                position: "top",
                icon: "warning",
                title: "Vui lòng xác nhận Checklist và Linh kiện trước khi gửi báo giá!",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                background: "#f59e0b", // vàng cảnh báo
                color: "#ffffff",
                iconColor: "#ffffff",
                customClass: {
                    popup: "rounded-xl shadow-lg",
                    title: "text-lg font-semibold",
                },
            });
            return;
        }

        try {
            // ✅ Tính lại tổng ngay tại thời điểm gửi
            const totalPrice = parts.reduce(
                (sum, p) => sum + Number(p.quantity) * Number(p.price),
                0
            );

            const quotationData = {
                maintenanceId: Number(jobId),
                checklist: checklist.map((c) => ({
                    checkListId: c.checkListId,
                    status: c.status || "none",
                })),
                parts: parts.map((p) => ({
                    componentID: Number(p.componentID),
                    quantity: Number(p.quantity),
                    price: Number(p.price),
                })),
                totalAmount: totalPrice, //  Không dùng state total
            };

            console.log("📦 Parts:", parts);
            console.log("💰 Tổng tính lại:", totalPrice);
            console.log("📤 Dữ liệu báo giá gửi đi:", quotationData);

            const res = await api.post("/quotations/create", quotationData);
            console.log("✅ Phản hồi từ server:", res.data);

            setQuotationSent(true);

            Swal.fire({
                toast: true,
                position: "top",
                icon: "success",
                title: "Gửi báo giá thành công!",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: "#10b981", // xanh ngọc
                color: "#ffffff",
                iconColor: "#ffffff",
                customClass: {
                    popup: "rounded-xl shadow-lg",
                    title: "text-lg font-semibold",
                },
            });
        } catch (err) {
            console.error("❌ Lỗi khi gửi báo giá:", err.response?.data || err);
            Swal.fire({
                toast: true,
                position: "top",
                icon: "error",
                title: "Gửi báo giá thất bại, vui lòng thử lại!",
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                background: "#ef4444", // đỏ lỗi
                color: "#ffffff",
                iconColor: "#ffffff",
                customClass: {
                    popup: "rounded-xl shadow-lg",
                    title: "text-lg font-semibold",
                },
            });
        }
    };


    if (loading) {
        return <div className="p-8 text-gray-600">⏳ Đang tải dữ liệu...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-8">
                <h1 className="text-3xl font-bold text-gray-800 border-b pb-3">
                    🧾 Báo giá bảo trì #{jobId}

                </h1>
                <button
                    onClick={() => navigate("/technician")}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
                </button>

                {/* Thông tin bảo trì */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">
                        Thông tin bảo trì
                    </h2>
                    {customer ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-600 text-sm">Tên khách hàng</label>
                                <input
                                    value={customer.customerName}
                                    readOnly
                                    className="border rounded-lg p-2 w-full bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm">Kỹ thuật viên phụ trách</label>
                                <input
                                    value={customer.technicianName}
                                    readOnly
                                    className="border rounded-lg p-2 w-full bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm">Model xe</label>
                                <input
                                    value={customer.vehicleModel}
                                    readOnly
                                    className="border rounded-lg p-2 w-full bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm">Biển số xe</label>
                                <input
                                    value={customer.licensePlate}
                                    readOnly
                                    className="border rounded-lg p-2 w-full bg-gray-100"
                                />
                            </div>

                        </div>
                    ) : (
                        <p className="text-gray-500">Không tìm thấy thông tin khách hàng.</p>
                    )}
                </section>

                {/* Checklist kiểm tra */}
                {/* Checklist kiểm tra */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">
                        Checklist kiểm tra
                    </h2>

                    <div className="space-y-4">
                        {checklist.map((item) => {
                            // Chọn màu viền & chữ dựa trên trạng thái
                            const statusColor =
                                item.status === "pass"
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : item.status === "fail"
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : "border-gray-300 bg-white text-gray-700";

                            return (
                                <div
                                    key={item.checkListId}
                                    className={`flex justify-between items-center border rounded-lg p-3 transition ${statusColor}`}
                                >
                                    <div>
                                        <p className="font-medium">{item.checkListName}</p>
                                        <p className="text-sm text-gray-500">{item.checkListType}</p>
                                    </div>

                                    <select
                                        className={`border rounded-lg p-2 text-sm ${item.status === "pass"
                                            ? "border-green-500 text-green-700"
                                            : item.status === "fail"
                                                ? "border-red-500 text-red-700"
                                                : "border-gray-300 text-gray-700"
                                            }`}
                                        value={item.status || "none"}
                                        onChange={(e) =>
                                            setChecklist((prev) =>
                                                prev.map((c) =>
                                                    c.checkListId === item.checkListId
                                                        ? { ...c, status: e.target.value }
                                                        : c
                                                )
                                            )
                                        }
                                    >
                                        <option value="none">Chưa kiểm</option>
                                        <option value="pass"> Đạt</option>
                                        <option value="fail"> Không đạt</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>
                </section>


                {/* Linh kiện thay thế */}
                <section>

                    {/* 📋 Nút lưu checklist */}
                    <div className="flex flex-col items-end mt-4">
                        <button
                            onClick={() => handleSaveChecklist(jobId, checklist)}
                            disabled={checklistSent}
                            className={`px-6 py-2 rounded-lg shadow-sm text-sm font-semibold transition 
                                     ${checklistSent
                                    ? "bg-gray-500 cursor-not-allowed text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                }`}
                        >
                            {checklistSent ? " Đã xác nhận" : "Xác nhận"}
                        </button>

                        {checklistMessage && (
                            <p
                                className={`mt-2 text-sm font-medium ${checklistMessageType === "success" ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {checklistMessage}
                            </p>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700 mb-3">
                        ⚙️ Linh kiện thay thế
                    </h2>
                    <div className="space-y-3">
                        {parts.map((part, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-4 gap-3 items-center border p-3 rounded-lg"
                            >
                                <select
                                    value={part.componentID}
                                    onChange={(e) =>
                                        handlePartChange(index, "componentID", e.target.value)
                                    }
                                    className="border rounded-lg p-2 w-full"
                                >
                                    <option value="">-- Chọn linh kiện --</option>
                                    {components.map((c) => (
                                        <option key={c.componentID} value={c.componentID}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    min="1"
                                    value={part.quantity}
                                    onChange={(e) =>
                                        handlePartChange(index, "quantity", +e.target.value)
                                    }
                                    className="border rounded-lg p-2 w-full"
                                />
                                <input
                                    type="number"
                                    value={part.price}
                                    readOnly
                                    className="border rounded-lg p-2 w-full bg-gray-100"
                                />
                                <span className="text-right font-semibold text-green-600">
                                    {(part.quantity * part.price).toLocaleString()} ₫
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleAddPart}
                        className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                        Thêm linh kiện
                    </button>
                    {/* 📦 Nút xác nhận gửi linh kiện (nằm bên phải, nhỏ hơn) */}
                    <div className="flex flex-col items-end mt-2">
                        <button
                            onClick={handleSendComponents}
                            disabled={isSendingParts || partsSent}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold text-white transition
                                     ${partsSent
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : isSendingParts
                                        ? "bg-gray-400 cursor-wait"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {isSendingParts
                                ? "⏳ Đang gửi linh kiện..."
                                : partsSent
                                    ? " Đã xác nhận"
                                    : "Xác nhận"}
                        </button>


                        {message && (
                            <p className={`mt-2 text-sm font-medium ${messageType === "error" ? "text-red-600" : "text-green-600"}`}>
                                {message}
                            </p>
                        )}
                    </div>

                </section>

                {/* Tổng tiền & nút gửi báo giá */}
                <section className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Tổng tiền:</h2>
                        <span className="text-2xl font-bold text-green-600">
                            {total.toLocaleString()} ₫
                        </span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={quotationSent}
                        className={`w-full py-3 rounded-xl font-semibold transition
                              ${quotationSent
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {quotationSent ? "⏳ Chờ khách hàng xác nhận" : "💰 Gửi báo giá"}
                    </button>
                </section>

            </div>
        </div>
    );

}
