import React, { useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Filter,
  Search,
  UserCheck,
} from "lucide-react";

const TechnicianManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState("");

  const tasks = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      vehicle: "VinFast VF5",
      issue: "Bảo dưỡng định kỳ 10.000km",
      status: "Chưa phân công",
      date: "2025-10-04",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      vehicle: "VinFast Lux SA2.0",
      issue: "Thay nhớt, kiểm tra phanh",
      status: "Đang thực hiện",
      date: "2025-10-03",
    },
    {
      id: 3,
      customer: "Phạm Văn C",
      vehicle: "VinFast VF8",
      issue: "Thay ắc quy, kiểm tra hệ thống điện",
      status: "Hoàn tất",
      date: "2025-10-01",
    },
  ];

  const technicians = ["Kỹ thuật viên 1", "Kỹ thuật viên 2", "Kỹ thuật viên 3"];

  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      selectedStatus === "Tất cả" || task.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const openAssignModal = (task) => {
    setSelectedTask(task);
    setAssignModalOpen(true);
  };

  const handleAssign = () => {
    console.log(`Phân công ${selectedTechnician} cho công việc #${selectedTask.id}`);
    setAssignModalOpen(false);
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <UserCheck className="text-blue-600" /> Phân công kỹ thuật viên
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
          <option>Tất cả</option>
          <option>Chưa phân công</option>
          <option>Đang thực hiện</option>
          <option>Hoàn tất</option>
        </select>
      </div>

      {/* Bảng danh sách công việc */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3">Khách hàng</th>
              <th className="px-6 py-3">Xe</th>
              <th className="px-6 py-3">Vấn đề</th>
              <th className="px-6 py-3">Ngày</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{task.customer}</td>
                <td className="px-6 py-4">{task.vehicle}</td>
                <td className="px-6 py-4">{task.issue}</td>
                <td className="px-6 py-4">{task.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      task.status === "Hoàn tất"
                        ? "bg-green-100 text-green-700"
                        : task.status === "Đang thực hiện"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => openAssignModal(task)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm flex items-center gap-1"
                  >
                    <Plus size={16} /> Phân công
                  </button>
                  <button className="px-3 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 text-sm flex items-center gap-1">
                    <Eye size={16} /> Xem
                  </button>
                </td>
              </tr>
            ))}

            {filteredTasks.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 py-6 italic"
                >
                  Không tìm thấy công việc nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal phân công */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Phân công kỹ thuật viên
            </h3>

            <p className="text-gray-600 mb-2">
              <strong>Khách hàng:</strong> {selectedTask?.customer}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Xe:</strong> {selectedTask?.vehicle}
            </p>

            <label className="block mb-2 font-medium text-gray-700">
              Chọn kỹ thuật viên
            </label>
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 mb-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn kỹ thuật viên --</option>
              {technicians.map((tech, idx) => (
                <option key={idx} value={tech}>
                  {tech}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedTechnician}
                className={`px-4 py-2 rounded-xl text-white ${
                  selectedTechnician
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TechnicianManagement
;
