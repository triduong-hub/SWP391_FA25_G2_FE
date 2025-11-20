import React, { useState, useEffect } from "react";
import api from "../../../../api";
import { statusMapServerToUI } from "../../../utils/statusHelpers";
import { useNavigate } from "react-router-dom";
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


const StaffDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTech, setSelectedTech] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("Tất cả chi nhánh");
  const [selectedShift, setSelectedShift] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const assignedStatuses = ["Đã xác nhận", "Đang thực hiện", "Chờ khách xác nhận báo giá", "Chờ thanh toán", "Hoàn tất"];
  const branches = ["Tất cả chi nhánh", ...new Set(orders.map(o => o.branch))];

  const navigate = useNavigate();


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/all");
        console.log("Booking API response:", res.data);


        const bookings = res.data.bookings || [];

        setOrders(
          bookings
            .map((b) => ({
              id: b.orderId,
              customer: b.customerName || "Chưa có tên",
              phone: b.customerPhone || "—",
              vehicle: `${b.vehicleModel || "—"} (${b.vehiclePlateNumber || ""})`,
              service:
                Array.isArray(b.serviceNames) && b.serviceNames.length > 0
                  ? b.serviceNames.join(", ")
                  : b.serviceType || "—",
              branch: b.serviceCenterName || "—",
              technician: b.technicianName || null,
              status: statusMapServerToUI[b.status?.trim()?.toLowerCase()] || "Đã hủy",
              price: b.totalCost ? `${b.totalCost.toLocaleString()} đ` : "—",
              orderDate: new Date(b.orderDate), // ✅ thêm để sắp xếp
              appointmentDate: b.appointmentDate || null,
            }))
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))

        );

      } catch (err) {
        console.error("Lỗi khi tải danh sách booking:", err);
      }
    };

    fetchBookings();

    // tự động refresh mỗi 10 giây
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await api.get("/employees/all/technicians");
        console.log("Technician API response:", res.data);
        console.log("techList :", res.data["List Of Technicians"] || res.data.refid || res.data.list || res.data.technicians || res.data.data);
        console.log("Technician API full response:", res);
        console.log("Technician API response data:", res.data);

        //  Lấy mảng đúng từ API
        let techList =
          res.data.refid?.["List Of Technicians"] ||
          res.data["List Of Technicians"] ||
          res.data.technicians ||
          res.data.data ||
          [];

        if (!Array.isArray(techList)) {
          console.warn("⚠️ Dữ liệu technicians không phải mảng:", techList);
          techList = [];
        }

        setTechnicians(
          techList.map((t) => ({
            id: Number(t.employeeID),
            name: t.name,
            branch: t.serviceCenterName || "Không rõ",
            shift: t.shiftName || "Không rõ", // 🕐 thêm ca làm việc
          }))
        );



        console.log("✅ Technicians sau khi map:", techList.map((t) => ({
          id: Number(t.employeeID),
          name: t.name,
        })));



      } catch (err) {
        console.error("Lỗi khi tải kỹ thuật viên:", err);
      }
    };


    fetchTechnicians();
  }, []);


  // Mở modal phân công
  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Xác nhận phân công kỹ thuật viên
  const handleConfirmAssign = async () => {
    if (!selectedTech) return alert("Vui lòng chọn kỹ thuật viên!");

    try {
      const payload = {
        orderId: Number(selectedOrder.id),
        technicianId: Number(selectedTech),
      };

      console.log("📦 Payload gửi đi:", payload);

      await api.post(`/maintenances/confirm`, payload);

      // ✅ Cập nhật UI sau khi API thành công
      const updated = orders.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, technician: technicians.find(t => t.id === Number(selectedTech))?.name, status: "Đã xác nhận" }
          : o
      );
      setOrders(updated);

      setShowModal(false);
      setSelectedTech("");
      setSelectedOrder(null);

      // alert("Phân công kỹ thuật viên thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi gán kỹ thuật viên:", err.response?.data || err);
      alert("Không thể lưu kỹ thuật viên xuống hệ thống.");
    }
  };


  // Xóa / Hủy đơn hàng
  const handleDeleteOrder = (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
  };

  // Hàm hỗ trợ format ngày để so sánh lọc (YYYY-MM-DD)
  const getYmd = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Tổng số liệu
  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "Chờ xác nhận").length;
  const confirmed = orders.filter((o) => o.status === "Đã xác nhận").length;
  const completed = orders.filter((o) => o.status === "Hoàn tất").length;

  return (
    <div className="w-full">

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
            <div className="text-gray-500 text-sm">Hoàn tất</div>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 w-full border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option>Tất cả trạng thái</option>
          <option>Chờ xác nhận</option>
          <option>Đã xác nhận</option>
          <option>Chờ khách xác nhận báo giá</option>
          <option>Đang thực hiện</option>
          <option>Chờ thanh toán</option>
          <option>Hoàn tất</option>
          <option>Đã hủy</option>
          <option>Không rõ</option>
        </select>


        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {branches.map((b, index) => (
            <option key={index} value={b}>
              {b}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        />

      </div>


      {/* Bảng danh sách đơn hàng */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4">Mã đơn</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Xe & Dịch vụ</th>
              <th className="py-3 px-4">Ngày Đặt</th>
              <th className="py-3 px-4">Chi nhánh</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">KTV</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((o) => {
                const matchStatus =
                  filterStatus === "Tất cả trạng thái" || o.status === filterStatus;
                const matchBranch =
                  filterBranch === "Tất cả chi nhánh" || o.branch === filterBranch;
                const matchSearch =
                  o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  o.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  o.id?.toString().includes(searchTerm);
                const matchDate = filterDate === "" || getYmd(o.orderDate) === filterDate;

                return matchStatus && matchBranch && matchSearch && matchDate;
              })


              .map((o) => (
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

                  <td className="py-3 px-4 text-xs text-gray-600">
                    <div className="font-medium text-gray-800">
                        {o.orderDate.toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-[11px] text-gray-500">
                        {o.orderDate.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    
                    {/* (Tùy chọn) Có thể hiện thêm ngày hẹn nhỏ bên dưới để Staff biết */}
                    {o.appointmentDate && (
                        <div className="text-[10px] text-blue-600 mt-1">
                            Hẹn: {new Date(o.appointmentDate).toLocaleDateString('vi-VN')}
                        </div>
                    )}
                  </td>

                  <td className="py-3 px-4">{o.branch}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${o.status === "Chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-700"
                        : o.status === "Đã xác nhận"
                          ? "bg-blue-100 text-blue-700"
                          : o.status === "Đang thực hiện"
                            ? "bg-orange-100 text-orange-700"
                            : o.status === "Chờ thanh toán"
                              ? "bg-purple-100 text-purple-700"
                              : o.status === "Hoàn tất"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {o.status}
                    </span>

                  </td>
                  <td className="py-3 px-4 text-gray-700">                    
                    {o.technician
                      ? o.technician
                      : assignedStatuses.includes(o.status)
                        ? <span className="font-medium text-blue-600">Đã phân công</span> // Dùng span cho đẹp hơn
                        : "Chưa phân công"}
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

            <p className="text-sm text-gray-600 mb-2">
              Chi nhánh: <strong>{selectedOrder?.branch}</strong>
            </p>

            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
            >
              <option value="">-- Chọn ca làm việc --</option>
              <option value="Ca Sáng">Ca Sáng</option>
              <option value="Ca Trưa">Ca Trưa</option>
              <option value="Ca Tối">Ca Tối</option>
            </select>

            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
            >
              <option value="">-- Chọn kỹ thuật viên --</option>
              {technicians
                .filter(
                  (t) =>
                    t.branch === selectedOrder?.branch &&
                    (selectedShift === "" || t.shift === selectedShift)
                )
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.shift}
                  </option>
                ))}




            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTech("");
                  setSelectedShift(""); //  reset luôn ca làm việc khi đóng modal
                }}
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
