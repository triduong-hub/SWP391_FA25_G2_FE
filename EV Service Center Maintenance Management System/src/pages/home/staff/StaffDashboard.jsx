import React, { useState, useEffect } from "react";
import {
  Search,
  UserRoundPlus,
  Check,
  X,
  Trash2,
  ClipboardList,
  Wrench,
  Clock,
  CheckCircle,
} from "lucide-react";
import API from "../../../../api";

const StaffDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      phone: "0901234567",
      vehicle: "Tesla Model 3",
      service: "Battery Check",
      branch: "District 1 Center",
      technician: null,
      status: "Chờ xác nhận",
      price: "500.000 đ",
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      phone: "0907654321",
      vehicle: "VinFast VF8",
      service: "Motor Service",
      branch: "District 7 Center",
      technician: "Trần Thị Bình",
      status: "Đã xác nhận",
      price: "800.000 đ",
    },
    {
      id: "ORD003",
      customer: "Lê Văn C",
      phone: "0912345678",
      vehicle: "BMW iX",
      service: "General Maintenance",
      branch: "Thu Duc Center",
      technician: null,
      status: "Chờ xác nhận",
      price: "1.200.000 đ",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTech, setSelectedTech] = useState("");
  const [technicians, setTechnicians] = useState([
    { id: 1, name: "Lê Văn Cường" },
    { id: 2, name: "Phạm Thị Dung" },
    { id: 3, name: "Nguyễn Thế Vinh" },
  ]);

  // Mở modal phân công
  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Xác nhận phân công kỹ thuật viên
  const handleConfirmAssign = async () => {
    if (!selectedTech) return alert("Vui lòng chọn kỹ thuật viên!");

    const updated = orders.map((o) =>
      o.id === selectedOrder.id
        ? { ...o, technician: selectedTech, status: "Đã xác nhận" }
        : o
    );
    setOrders(updated);

    // Gọi API thật khi backend sẵn
    /*
    try {
      await API.put(`/orders/${selectedOrder.id}/assign`, {
        technicianName: selectedTech,
      });
    } catch (err) {
      console.error("Lỗi khi phân công kỹ thuật viên:", err);
    }
    */

    setShowModal(false);
    setSelectedTech("");
    setSelectedOrder(null);
  };

  // Xác nhận đơn hàng
  // const handleConfirmOrder = (orderId) => {
  //   const updated = orders.map((o) =>
  //     o.id === orderId ? { ...o, status: "Đã xác nhận" } : o
  //   );
  //   setOrders(updated);
  // };

  // Xóa / Hủy đơn hàng
  const handleDeleteOrder = (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
  };

  // Tổng số liệu
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Chờ xác nhận").length;
  const confirmed = orders.filter((o) => o.status === "Đã xác nhận").length;
  const completed = orders.filter((o) => o.status === "Hoàn thành").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Staff Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Quản lý đơn hàng và phân công kỹ thuật viên
      </p>

      {/* Cards thống kê */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <ClipboardList className="text-blue-500" size={28} />
          <div>
            <div className="text-gray-500 text-sm">Tổng đơn hàng</div>
            <div className="text-xl font-semibold">{totalOrders}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <Clock className="text-yellow-500" size={28} />
          <div>
            <div className="text-gray-500 text-sm">Chờ xác nhận</div>
            <div className="text-xl font-semibold">{pending}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <Wrench className="text-blue-500" size={28} />
          <div>
            <div className="text-gray-500 text-sm">Đã xác nhận</div>
            <div className="text-xl font-semibold">{confirmed}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <CheckCircle className="text-green-500" size={28} />
          <div>
            <div className="text-gray-500 text-sm">Hoàn thành</div>
            <div className="text-xl font-semibold">{completed}</div>
          </div>
        </div>
      </div>

      {/* Ô tìm kiếm + lọc */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            className="pl-9 pr-3 py-2 w-full border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select className="border rounded-lg px-3 py-2 text-sm">
          <option>Tất cả trạng thái</option>
          <option>Chờ xác nhận</option>
          <option>Đã xác nhận</option>
          <option>Hoàn thành</option>
        </select>
      </div>

      {/* Bảng danh sách đơn hàng */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4">Mã đơn</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Xe & Dịch vụ</th>
              <th className="py-3 px-4">Chi nhánh</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">KTV</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{o.id}</td>
                <td className="py-3 px-4">
                  <div>{o.customer}</div>
                  <div className="text-gray-500 text-xs">{o.phone}</div>
                </td>
                <td className="py-3 px-4">
                  <div>{o.vehicle}</div>
                  <div className="text-gray-500 text-xs">{o.service}</div>
                </td>
                <td className="py-3 px-4">{o.branch}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      o.status === "Chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-700"
                        : o.status === "Đã xác nhận"
                        ? "bg-blue-100 text-blue-700"
                        : o.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {o.technician || "Chưa phân công"}
                </td>
                <td className="py-3 px-4 text-center space-x-2">
                  <button
                    onClick={() => handleAssignClick(o)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Phân công kỹ thuật viên"
                  >
                    <UserRoundPlus size={18} />
                  </button>
                  <button
                    onClick={() => handleConfirmOrder(o.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Xác nhận đơn"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(o.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Xóa đơn"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal phân công kỹ thuật viên */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Phân công kỹ thuật viên
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Đơn hàng: <strong>{selectedOrder?.id}</strong>
            </p>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
            >
              <option value="">-- Chọn kỹ thuật viên --</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
              >
                <X size={16} /> Hủy
              </button>
              <button
                onClick={handleConfirmAssign}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                <Check size={16} /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
