import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../api";
import { ArrowLeft, ClipboardList, Wrench, DollarSign } from "lucide-react";
import Swal from "sweetalert2";


export default function QuotationDetailPage() {
  const { maintenanceId } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        console.log("🟡 Gọi API báo giá cho maintenanceId:", maintenanceId);
        const res = await api.get(`/quotations/maintenance/${maintenanceId}`);
        console.log("📦 Dữ liệu từ API:", res.data);

        const q = res.data.data;

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
          parts: q.componentsUsed?.map((item) => ({
            maintenanceComponentId: item.maintenanceComponentID,
            name: item.componentName,
            quantity: item.quantity,
            price: item.componentPrice,
          })),

        };

        console.log("✅ Dữ liệu sau khi format:", formattedQuotation);
        setQuotation(formattedQuotation);
      } catch (err) {
        console.error("❌ Lỗi khi tải báo giá:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotation();
  }, [maintenanceId]);


  // ✅ Hàm tính lại tổng tiền linh kiện
  const calculateTotal = (parts) => {
    return parts.reduce((sum, p) => sum + p.price * p.quantity, 0);
  };

  // ✅ Hàm xử lý khi đổi số lượng
  const handleQuantityChange = async (index, newQuantity) => {
    const updatedParts = [...quotation.parts];
    const part = updatedParts[index];

    if (newQuantity <= 0) return;

    // Cập nhật tạm UI
    updatedParts[index].quantity = Number(newQuantity);
    const newTotal = calculateTotal(updatedParts);
    setQuotation({ ...quotation, parts: updatedParts, totalAmount: newTotal });


    try {
      console.log("🟡 Dữ liệu gửi PUT:", {
        maintenanceId,
        maintenanceComponentId: part.maintenanceComponentId,
        newQuantity,
      });
      await api.put(
        `/maintenances/${maintenanceId}/components/${part.maintenanceComponentId}/quantity`,
        { quantity: Number(newQuantity) }
      );


      console.log("✅ Cập nhật thành công linh kiện:", part.name);

      Swal.fire({
        toast: true,
        position: "top", // hiện từ trên xuống
        icon: "success",
        title: `Đã cập nhật số lượng "${part.name}" thành công!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#10b981", // xanh ngọc đậm đẹp mắt
        color: "#ffffff", // chữ trắng rõ ràng
        iconColor: "#ffffff",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-semibold",
        },
      });


    } catch (error) {
      console.error("❌ Lỗi khi cập nhật số lượng:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "❌ Cập nhật thất bại! Vui lòng thử lại sau.",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: "#ef4444", // đỏ tươi
        color: "#ffffff", // chữ trắng
        iconColor: "#ffffff",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-semibold",
        },
      });
    }
  };

  // ✅ Hàm xử lý xóa linh kiện
  const handleDeletePart = async (index) => {
    const part = quotation.parts[index];

    const result = await Swal.fire({
      title: `Xác nhận xóa linh kiện?`,
      text: `Bạn có chắc muốn xóa "${part.name}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#dc2626", // đỏ
      cancelButtonColor: "#6b7280", // xám
    });

    if (!result.isConfirmed) return;

    try {
      console.log("🗑️ Gọi API xóa linh kiện:", {
        maintenanceId,
        maintenanceComponentId: part.maintenanceComponentId,
      });

      await api.delete(
        `/maintenances/${maintenanceId}/components/${part.maintenanceComponentId}`
      );

      // Xóa khỏi UI
      const updatedParts = quotation.parts.filter((_, i) => i !== index
      );
      const newTotal = calculateTotal(updatedParts);
      setQuotation({ ...quotation, parts: updatedParts, totalAmount: newTotal });
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: `Đã xóa linh kiện "${part.name}" thành công!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#10b981", // xanh ngọc đẹp mắt
        color: "#ffffff", // chữ trắng rõ
        iconColor: "#ffffff",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-semibold",
        },
      });


    } catch (error) {
      console.error("❌ Lỗi khi xóa linh kiện:", error);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: "❌ Xóa thất bại! Vui lòng thử lại.",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: "#ef4444", // đỏ tươi
        color: "#ffffff", // chữ trắng
        iconColor: "#ffffff",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-semibold",
        },
      });

    }
  };




  if (loading)
    return <div className="p-8 text-gray-600 text-lg">⏳ Đang tải dữ liệu...</div>;

  if (!quotation)
    return (
      <div className="p-8 text-red-600 font-semibold">
        Không tìm thấy báo giá #{maintenanceId}
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
            Báo giá #{maintenanceId}
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
                <th className="border p-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {quotation.parts.map((p, index) => (
                <tr key={p.maintenanceComponentId} className="border-b">
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={p.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="w-20 text-center border rounded-md p-1 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </td>
                  <td className="border p-2 text-right">{formatCurrency(p.price)}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(p.price * p.quantity)}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDeletePart(index)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Xóa
                    </button>
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
