import React, { useEffect, useState } from "react";
import { DollarSign, Users, FileText, BarChart } from "lucide-react";
import API from "../../../api"; // hoặc axios trực tiếp

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
        const res = await API.get("/invoices/getAll");
        const invoices = res.data.data || [];

        // 👉 Tính toán số liệu thực
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter((i) => i.status === "PAID");
        const pendingInvoices = invoices.filter((i) => i.status === "PENDING");

        const totalRevenue = paidInvoices.reduce(
          (sum, inv) => sum + inv.totalAmount,
          0
        );

        const totalCustomers = new Set(
          invoices.map((inv) => inv.customerEmail)
        ).size;

        const paymentRate =
          totalInvoices > 0
            ? ((paidInvoices.length / totalInvoices) * 100).toFixed(1)
            : 0;

        setSummary({
          totalRevenue,
          totalInvoices,
          totalCustomers,
          paymentRate,
        });

        // 👉 Chuẩn hóa dữ liệu cho bảng
        const mapped = invoices.map((inv) => ({
          id: inv.invoiceID,
          customer: inv.customerName,
          amount: inv.totalAmount,
          date: new Date(inv.issuedDate).toLocaleString("vi-VN"),
          status: inv.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán",
        }));

        setTransactions(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
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

      {/* 📊 Thông tin tổng hợp */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          color="from-emerald-400 to-green-500"
          icon={<DollarSign className="w-8 h-8 text-white" />}
          title="Tổng doanh thu"
          value={summary.totalRevenue.toLocaleString("vi-VN") + " đ"}
        />
        <SummaryCard
          color="from-blue-400 to-sky-500"
          icon={<FileText className="w-8 h-8 text-white" />}
          title="Số hóa đơn"
          value={summary.totalInvoices}
        />
        <SummaryCard
          color="from-violet-400 to-indigo-500"
          icon={<Users className="w-8 h-8 text-white" />}
          title="Khách hàng"
          value={summary.totalCustomers}
        />
        <SummaryCard
          color="from-amber-400 to-orange-500"
          icon={<BarChart className="w-8 h-8 text-white" />}
          title="Tỷ lệ thanh toán"
          value={`${summary.paymentRate}%`}
        />
      </div>


      {/* Bộ lọc */}
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

      {/* Bảng hóa đơn */}
      <div className="bg-white/90 backdrop-blur rounded-xl overflow-x-auto shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="p-3">Mã HĐ</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Ngày xuất</th>
              <th className="p-3">Số tiền</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr
                key={t.id}
                className="border-b hover:bg-emerald-50/50 transition"
              >
                <td className="p-3 text-gray-800">{t.id}</td>
                <td className="p-3 text-gray-800">{t.customer}</td>
                <td className="p-3 text-gray-800">{t.date}</td>
                <td className="p-3 font-semibold text-gray-800">
                  {t.amount.toLocaleString("vi-VN")} đ
                </td>
                <td
                  className={`p-3 font-medium ${t.status === "Đã thanh toán"
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

const SummaryCard = ({ icon, title, value, color }) => (
  <div className="relative overflow-hidden rounded-2xl shadow-md bg-white hover:shadow-lg transition-all duration-300">
    {/* Header gradient */}
    <div
      className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${color}`}
    ></div>

    <div className="flex items-center justify-between p-5">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
      </div>
      <div
        className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow text-white`}
      >
        {icon}
      </div>
    </div>
  </div>
);


export default RevenueManagement;
