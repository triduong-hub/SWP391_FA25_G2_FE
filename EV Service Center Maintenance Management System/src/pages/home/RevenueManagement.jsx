import React, { useEffect, useState } from "react";
import { BarChart, DollarSign, Users, FileText } from "lucide-react";

const RevenueManagement = () => {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ keyword: "", status: "all" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = {
          summary: {
            totalRevenue: 125000000,
            totalInvoices: 320,
            totalCustomers: 150,
            growth: 12,
          },
          transactions: [
            {
              id: 1,
              customer: "Nguyễn Văn A",
              amount: 2000000,
              date: "2025-09-01",
              status: "Đã thanh toán",
            },
            {
              id: 2,
              customer: "Trần Thị B",
              amount: 1500000,
              date: "2025-09-02",
              status: "Chưa thanh toán",
            },
            {
              id: 3,
              customer: "Lê Văn C",
              amount: 3000000,
              date: "2025-09-03",
              status: "Đã thanh toán",
            },
          ],
        };

        setSummary(data.summary);
        setTransactions(data.transactions);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu doanh thu.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesKeyword =
      filter.keyword === "" ||
      t.customer.toLowerCase().includes(filter.keyword.toLowerCase());
    const matchesStatus =
      filter.status === "all" || t.status === filter.status;
    return matchesKeyword && matchesStatus;
  });

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Quản lý Doanh thu
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={<DollarSign className="w-6 h-6 text-gray-700" />}
          title="Tổng doanh thu"
          value={summary.totalRevenue?.toLocaleString() + " đ"}
        />
        <SummaryCard
          icon={<FileText className="w-6 h-6 text-gray-700" />}
          title="Số hóa đơn"
          value={summary.totalInvoices}
        />
        <SummaryCard
          icon={<Users className="w-6 h-6 text-gray-700" />}
          title="Khách hàng"
          value={summary.totalCustomers}
        />
        <SummaryCard
          icon={<BarChart className="w-6 h-6 text-gray-700" />}
          title="Tăng trưởng"
          value={`${summary.growth}%`}
        />
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-4 flex items-center gap-4 shadow">
        <input
          type="text"
          placeholder="Tìm theo khách hàng..."
          value={filter.keyword}
          onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
          className="border border-gray-300 px-3 py-2 rounded w-1/3 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đã thanh toán">Đã thanh toán</option>
          <option value="Chưa thanh toán">Chưa thanh toán</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/90 backdrop-blur rounded-xl overflow-x-auto shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="p-3">Mã HĐ</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Ngày</th>
              <th className="p-3">Số tiền</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b hover:bg-emerald-50/50 transition">
                <td className="p-3 text-gray-800">{t.id}</td>
                <td className="p-3 text-gray-800">{t.customer}</td>
                <td className="p-3 text-gray-800">{t.date}</td>
                <td className="p-3 font-semibold text-gray-800">
                  {t.amount.toLocaleString()} đ
                </td>
                <td
                  className={`p-3 font-medium ${
                    t.status === "Đã thanh toán"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {t.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <p className="p-4 text-gray-500">Không có dữ liệu phù hợp</p>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value }) => (
  <div className="bg-white/95 backdrop-blur rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition">
    <div className="p-3 bg-emerald-100 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default RevenueManagement;
