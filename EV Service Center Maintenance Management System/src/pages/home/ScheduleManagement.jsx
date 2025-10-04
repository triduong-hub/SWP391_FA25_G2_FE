import React, { useState, useEffect } from "react";

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    keyword: "",
    status: "",
    date: "",
  });

  // Fetch API danh sách lịch
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // Demo data
      const demoData = [
        {
          id: 1,
          vehicle: "51H-12345",
          customer: "Nguyễn Văn A",
          type: "Bảo dưỡng định kỳ",
          date: "2025-09-28",
          status: "Đã đặt",
        },
        {
          id: 2,
          vehicle: "29A-67890",
          customer: "Trần Thị B",
          type: "Sửa chữa",
          date: "2025-09-29",
          status: "Đang xử lý",
        },
        {
          id: 3,
          vehicle: "EV-00123",
          customer: "Lê Văn C",
          type: "Kiểm tra tổng quát",
          date: "2025-10-01",
          status: "Hoàn thành",
        },
      ];

      let filtered = demoData.filter((item) => {
        return (
          (filter.keyword === "" ||
            item.vehicle.includes(filter.keyword) ||
            item.customer.includes(filter.keyword)) &&
          (filter.status === "" || item.status === filter.status) &&
          (filter.date === "" || item.date === filter.date)
        );
      });

      setSchedules(filtered);
    } catch (error) {
      console.error("Lỗi khi tải lịch bảo dưỡng:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, [filter]);

  const handleAdd = () => {
    alert("➕ Thêm lịch bảo dưỡng");
  };

  const handleEdit = (id) => {
    alert("✏️ Sửa lịch ID: " + id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch ID: " + id + " ?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 min-h-screen rounded-2xl space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">
         Quản lý Lịch bảo dưỡng
      </h2>

      {/* Bộ lọc */}
      <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Tìm theo khách hàng hoặc xe..."
          value={filter.keyword}
          onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
          className="border border-gray-300 px-3 py-2 rounded w-64 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">-- Trạng thái --</option>
          <option value="Đã đặt">Đã đặt</option>
          <option value="Đang xử lý">Đang xử lý</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Hủy">Hủy</option>
        </select>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button
          onClick={() => fetchSchedules()}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          Tìm kiếm
        </button>
        <button
          onClick={() => setFilter({ keyword: "", status: "", date: "" })}
          className="bg-gradient-to-r from-gray-400 to-gray-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          Reset
        </button>
      </div>

      {/* Nút thêm */}
      <div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          ➕ Thêm lịch bảo dưỡng
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">⏳ Đang tải dữ liệu...</p>
        ) : schedules.length === 0 ? (
          <p className="p-4 text-gray-500">⚠️ Không có lịch nào.</p>
        ) : (
          <table className="w-full border-collapse text-gray-900">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
                <th className="p-3">ID</th>
                <th className="p-3">Xe</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Loại bảo dưỡng</th>
                <th className="p-3">Ngày đặt lịch</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-emerald-50/50 transition"
                >
                  <td className="p-3">{s.id}</td>
                  <td className="p-3">{s.vehicle}</td>
                  <td className="p-3">{s.customer}</td>
                  <td className="p-3">{s.type}</td>
                  <td className="p-3">{s.date}</td>
                  <td
                    className={`p-3 font-medium ${
                      s.status === "Hoàn thành"
                        ? "text-green-600"
                        : s.status === "Đang xử lý"
                        ? "text-yellow-600"
                        : s.status === "Hủy"
                        ? "text-red-500"
                        : "text-blue-600"
                    }`}
                  >
                    {s.status}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(s.id)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;
