import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api";
import { ArrowLeft, ClipboardList, Wrench, DollarSign } from "lucide-react";

export default function QuotationDetailPage() {
  const { quotationId } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        console.log("🟡 Đang gọi API với ID:", quotationId);
          const res = await api.get(`/quotations/maintenance/${quotationId}`);
        const q = res.data.data;

        // 👉 Chuyển đổi key để React đọc đúng
        const formattedQuotation = {
          customerName: q.customerName,
          technicianName: q.technicianName,
          licensePlate: q.vehicleLicensePlate,
          vehicleModel: q.vehicleModel,
          totalAmount: q.totalAmount,
          status:
            q.status === "PENDING"
              ? "Chờ xác nhận"
              : q.status === "COMPLETED"
                ? "Hoàn tất"
                : q.status,
          checklist: q.checklistItemsStatus || [],
          parts: q.quotationDetails?.map((item) => ({
            componentID: item.quotationDetailID,
            name: item.itemName,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        };

        console.log(" Dữ liệu sau khi format:", formattedQuotation);
        setQuotation(formattedQuotation);
      } catch (err) {
        console.error(" Lỗi khi tải báo giá:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, [quotationId]);


  if (loading)
    return <div className="p-8 text-gray-600 text-lg">⏳ Đang tải dữ liệu...</div>;

  if (!quotation)
    return (
      <div className="p-8 text-red-600 font-semibold">
        Không tìm thấy báo giá #{quotationId}
      </div>
    );

  const formatCurrency = (num) =>
    num?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Báo giá #{quotationId}
          </h1>
          <p className="text-gray-500 text-sm">
            Chi tiết thông tin bảo dưỡng và linh kiện
          </p>
        </div>
        <button
          onClick={() => navigate("/techniciandash")}
          className="flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
        </button>
      </div>

      {/* Thông tin khách hàng */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-3">📋 Thông tin chung</h2>
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
          <h2 className="text-xl font-semibold">Checklist</h2>
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
          <p className="text-gray-500 italic">Không có mục checklist</p>
        )}
      </div>

      {/* Linh kiện */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center mb-3">
          <Wrench className="w-5 h-5 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold">Linh kiện thay thế</h2>
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
                <tr key={p.componentID} className="border-b">
                  <td className="border p-2">{p.name}</td>
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
            <p className="text-gray-600">Trạng thái:</p>
            <p
              className={`font-semibold ${quotation.status === "Đã xác nhận"
                  ? "text-blue-600"
                  : quotation.status === "Hoàn tất"
                    ? "text-green-600"
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
      </div>
    </div>
  );
}
