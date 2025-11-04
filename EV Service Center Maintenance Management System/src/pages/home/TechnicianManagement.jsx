import React, { useState, useEffect } from "react";
import { UserCheck, Search } from "lucide-react";
import api from "../../../api"; // axios instance
import { statusMapServerToUI } from "../../utils/statusHelpers";

const TechnicianManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const statusList = ["Tất cả", ...new Set(tasks.map((t) => t.status))];


  // 🔹 Lấy dữ liệu thật từ API
  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const res = await api.get("/maintenances/all");
        const data = res.data;

        const mapped = data.Maintenances.map((m) => ({
          id: m.maintenanceID,
          customer: m.customerName,
          vehicle: `${m.model} (${m.licensePlate})`,
          technician: m.empName || "Chưa phân công",
          date: m.startTime
            ? new Date(m.startTime).toLocaleDateString("vi-VN")
            : "—",
          status: statusMapServerToUI[m.status?.toLowerCase()] || m.status,
        }));

        setTasks(mapped);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bảo trì:", error);
      }
    };

    fetchMaintenances();
  }, []);

  // 🔍 Lọc danh sách
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      selectedStatus === "Tất cả" || task.status === selectedStatus;
    return matchSearch && matchStatus;
  });
  

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <UserCheck className="text-blue-600" /> Quản lý bảo trì
      </h2>

      {/* Thanh công cụ */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm w-full md:w-1/3">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Tìm khách hàng hoặc xe..."
            className="w-full border-none focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 rounded-xl border border-gray-300 bg-white shadow-sm"
        >
          {statusList.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Khách hàng</th>
              <th className="px-6 py-3">Xe</th>
              <th className="px-6 py-3">Kỹ thuật viên</th>
              <th className="px-6 py-3">Ngày</th>
              <th className="px-6 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">{task.id}</td>
                <td className="px-6 py-4 font-medium">{task.customer}</td>
                <td className="px-6 py-4">{task.vehicle}</td>
                <td className="px-6 py-4">{task.technician}</td>
                <td className="px-6 py-4">{task.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${task.status === "Hoàn tất"
                      ? "bg-green-100 text-green-700"
                      : task.status === "Đang thực hiện" ||
                        task.status === "Khách đã xác nhận" ||
                        task.status === "Đã xác nhận"
                        ? "bg-yellow-100 text-yellow-700"
                        : task.status === "Chờ thanh toán" ||
                          task.status === "Chờ khách xác nhận báo giá" ||
                          task.status === "Chờ xác nhận"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {task.status}
                  </span>

                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 italic"
                >
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TechnicianManagement;
