import React, { useState, useEffect } from "react";
import api from "../../../api";
import { Edit, Trash2 } from "lucide-react";
import { statusMapServerToUI } from "../../utils/statusHelpers"; // đường dẫn file map trạng thái


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
      const response = await api.get("/bookings/all");
      console.log("📦 Dữ liệu API trả về:", response.data);

      let data = [];

      // 🧩 Kiểm tra cấu trúc dữ liệu trả về
      if (Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data.bookings)) {
        data = response.data.bookings;
      } else if (Array.isArray(response.data.result)) {
        data = response.data.result;
      } else {
        console.warn("⚠️ API không trả về mảng hợp lệ:", response.data);
      }

      // 🧭 Chuẩn hóa dữ liệu
      data = data.map((item) => ({
        id: item.orderId,
        vehicle: `${item.vehicleModel || "—"} (${item.vehiclePlateNumber || ""})`,
        customer: item.customerName || "—",
        type:
          Array.isArray(item.serviceNames) && item.serviceNames.length > 0
            ? item.serviceNames.join(", ")
            : item.serviceType || "—",
        date: item.appointmentDate || "—",
        branch: item.serviceCenterName || "—",
        status: statusMapServerToUI[item.status?.toLowerCase()] || item.status || "—",
      }));


      // 🎯 Lọc dữ liệu theo filter
      const filtered = data.filter((item) => {
        return (
          (filter.keyword === "" ||
            item.vehicle?.toLowerCase().includes(filter.keyword.toLowerCase()) ||
            item.customer?.toLowerCase().includes(filter.keyword.toLowerCase())) &&
          (filter.status === "" || item.status === filter.status) &&
          (filter.date === "" || item.date === filter.date)
        );
      });



      setSchedules(filtered);
    } catch (error) {
      console.error("❌ Lỗi khi tải lịch bảo dưỡng:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      await fetchSchedules();
    };
    load();
    return () => {
      isMounted = false;
    };
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn tất":
        return "text-green-600";
      case "Đang xử lý":
        return "text-yellow-600";
      case "Hủy":
        return "text-red-500";
      default:
        return "text-blue-600";
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
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đang thực hiện">Đang thực hiện</option>
          <option value="Hoàn tất">Hoàn tất</option>
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
        {/* <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          ➕ Thêm lịch bảo dưỡng
        </button> */}
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">⏳ Đang tải dữ liệu...</p>
        ) : schedules.length === 0 ? (
          <p className="p-4 text-gray-500">⚠️ Không có lịch nào.</p>
        ) : (
          <table className="w-full border-collapse text-gray-900 table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
                <th className="p-3 w-16 text-center">ID</th>
                <th className="p-3 w-40 text-left">Xe</th>
                <th className="p-3 w-40 text-left">Khách hàng</th>
                <th className="p-3 w-48 text-left">Loại bảo dưỡng</th>
                <th className="p-3 w-32 text-center">Ngày đặt</th>
                <th className="p-3 w-28 text-center">Trạng thái</th>
                <th className="p-3 w-32 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, index) => (
                <tr
                  key={s.id ?? `row-${index}`}
                  className="border-b hover:bg-emerald-50 transition-all duration-150"
                >
                  <td className="p-3 text-center">{s.id}</td>
                  <td className="p-3 max-w-[160px] break-words">{s.vehicle}</td>
                  <td className="p-3 max-w-[160px] break-words">{s.customer}</td>
                  <td className="p-3 max-w-[200px] break-words">{s.type}</td>
                  <td className="p-3 text-center">{s.date}</td>
                  <td className={`p-3 font-medium text-center ${getStatusColor(s.status)}`}>
                    {s.status}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(s.id)}
                        className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
