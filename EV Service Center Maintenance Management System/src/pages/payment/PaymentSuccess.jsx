import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../../api"; // đường dẫn đến file axios config

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ hook điều hướng
  const [updateStatus, setUpdateStatus] = useState("loading");


  useEffect(() => {
    // 📌 Đọc query params từ URL
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const cancel = queryParams.get("cancel");
    const paymentLinkId = queryParams.get("id"); // ✅ đây là paymentLinkId thực tế
    const orderCode = queryParams.get("orderCode");

    console.log("🔍 PayOS redirect data:", { status, cancel, paymentLinkId, orderCode });

    // ✅ Chỉ cập nhật khi thanh toán thành công
    // ✅ Kiểm tra kết quả thanh toán
    if (status?.toUpperCase() === "PAID" && cancel === "false" && paymentLinkId) {
      updatePaymentStatus(paymentLinkId);
    } else if (cancel === "true" || status?.toUpperCase() === "CANCELLED") {
      console.warn("🚫 Người dùng đã hủy thanh toán.");
      // ⏳ Delay nhỏ cho UI hiển thị rồi quay lại home
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }

  }, [location]);

  // 📡 Gọi API backend để update trạng thái thanh toán
  const updatePaymentStatus = async (paymentLinkId) => {
    try {
      const res = await api.put(`/payment/update-status/success/${paymentLinkId}`);
      console.log("✅ Cập nhật thành công:", res.data);
      setUpdateStatus("success");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      setUpdateStatus("error");
    }
  };


  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold text-green-600">
        Thanh toán thành công!
      </h1>

      {updateStatus === "loading" && (
        <p className="text-gray-500">Đang cập nhật trạng thái...</p>
      )}

      {updateStatus === "success" && (
        <p className="text-green-600">Trạng thái đã được cập nhật 💚</p>
      )}

      {updateStatus === "error" && (
        <p className="text-red-500">
          Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại sau!
        </p>
      )}

      {/*  Nút quay lại trang chủ */}
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all"
      >
        Quay lại trang chủ
      </button>
    </div>
  );

};

export default PaymentSuccess;
