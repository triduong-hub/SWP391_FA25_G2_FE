import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Wrench, CheckCircle, FileText,
    Play, User, Phone, MapPin, XCircle, Activity,
    Search
} from 'lucide-react';
import api from '../../../../api'; // ✅ để bạn nối API thật
import { statusMapServerToUI, statusMapUIToServer } from "../../../utils/statusHelpers";
import { useNavigate } from "react-router-dom";


const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [noteModal, setNoteModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [newNote, setNewNote] = useState('');

    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                console.log("🔍 1. Raw LocalStorage:", storedUser); // Xem chuỗi JSON gốc

                if (!storedUser) {
                    console.error("❌ LocalStorage rỗng! Bạn cần kiểm tra lại code trang Login xem đã setItem('user', ...) chưa.");
                    return;
                }

                const currentUser = JSON.parse(storedUser);
                console.log("🔍 2. Parsed User:", currentUser);

                // Lưu ý: Kiểm tra xem biến lưu ID của bạn là employeeID, id, hay userId
                const technicianId = currentUser.employeeID;

                if (!technicianId) {
                    console.error("❌ Không tìm thấy ID Kỹ thuật viên (Backend chưa gửi về?)");
                    return;
                }

                // BƯỚC 2: Gọi API lọc theo ID
                const res = await api.get(`/maintenances/technician/${technicianId}`);

                console.log("Dữ liệu bảo trì của tôi:", res.data);

                const maintenances = Array.isArray(res.data.Maintenances)
                    ? res.data.Maintenances
                    : [];

                // Sắp xếp đơn mới nhất nằm đầu tiên (Giữ nguyên logic cũ)
                const sortedMaintenances = maintenances.sort(
                    (a, b) =>
                        new Date(b.createdAt || b.startTime || b.maintenanceDate) -
                        new Date(a.createdAt || a.startTime || a.maintenanceDate)
                );

                setTasks(sortedMaintenances);
            } catch (err) {
                console.error(" Lỗi khi lấy danh sách công việc:", err);
            }
        };

        fetchTasks();
    }, []);


    // ---------------- UTILS ----------------
    const getStatusBadge = (status) => {
        const colors = {
            assigned: 'bg-blue-100 text-blue-700',
            in_progress: 'bg-yellow-100 text-yellow-700',
            completed: 'bg-green-100 text-green-700',
        };
        const labels = {
            assigned: 'Chờ xử lý',
            in_progress: 'Đang thực hiện',
            completed: 'Hoàn tất',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
                {labels[status] || status}
            </span>
        );
    };

    const normalizedTasks = tasks.map((t) => ({
        ...t,
        status: t.status
            ? t.status.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-")
            : "",
    }));


    const formatDate = (date, time) => `${new Date(date).toLocaleDateString('vi-VN')} ${time}`;

    const getYmd = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // ---------------- HANDLERS ----------------
    // Khi kỹ thuật viên bấm "Bắt đầu"
    // Khi kỹ thuật viên bấm "Bắt đầu"
    const handleStart = async (maintenanceID) => {
        try {
            // Gọi API backend thật
            await api.put(`/maintenances/${maintenanceID}/set-status/in-progress`);


            // Cập nhật UI
            setTasks(prev =>
                prev.map(t =>
                    t.maintenanceID === maintenanceID ? { ...t, status: "in-progress" } : t
                )
            );
            // alert(`✅ Đơn ${maintenanceID} đã chuyển sang "Đang thực hiện"`);
        } catch (err) {
            console.error("❌ Lỗi khi bắt đầu:", err);
            alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
        }
    };

    // Khi kỹ thuật viên bấm "Hoàn tất"
    const handleComplete = async (maintenanceID) => {
        try {
            await api.put(`/maintenances/${maintenanceID}/set-status/waiting-for-payment`);
            await api.post(`/invoices/create`, { maintenanceId: maintenanceID });

            setTasks(prev =>
                prev.map(t =>
                    t.maintenanceID === maintenanceID ? { ...t, status: "waiting-for-payment" } : t
                )
            );
            // alert(`🏁 Đơn ${maintenanceID} đã chuyển sang "Chờ thanh toán"`);
        } catch (err) {
            console.error("❌ Lỗi khi hoàn tất:", err);
            alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
        }
    };


    const handleSaveNote = async () => {
        if (!newNote.trim()) return;
        setTasks(prev => prev.map(t =>
            t.id === selectedTask.id
                ? { ...t, technicianNotes: [...t.technicianNotes, { time: new Date().toLocaleTimeString(), note: newNote }] }
                : t
        ));
        setNewNote('');
        setNoteModal(false);
        // await API.post(`/technician/tasks/${selectedTask.id}/notes`, { note: newNote });
    };

    // ---------------- STATS ----------------
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.date === today);

    // Gom nhóm số lượng theo trạng thái
    // Gom nhóm số lượng theo trạng thái (chuẩn hoá về snake_case)
    const statusCounts = tasks.reduce((acc, t) => {
        const raw = t.status || "unknown";
        const status = raw
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "_")  // chuyển mọi ký tự đặc biệt thành _
            .replace(/^_+|_+$/g, "");     // bỏ _ thừa ở đầu/cuối
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});


    // Cấu hình icon + màu cho từng trạng thái
    const statusConfig = {
        pending: { icon: Clock, color: "gray", label: "Chờ xác nhận" },
        confirmed: { icon: Calendar, color: "blue", label: "Đã xác nhận" },
        assigned: { icon: Clock, color: "yellow", label: "Chờ xử lý" },
        in_progress: { icon: Wrench, color: "purple", label: "Đang thực hiện" },
        waiting_for_payment: { icon: FileText, color: "orange", label: "Chờ thanh toán" },
        completed: { icon: CheckCircle, color: "green", label: "Hoàn tất" },
    };


    // ---------------- RENDER ----------------
    return (
        <div className="w-full">

            {/* 📊 STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={Calendar}
                    color="blue"
                    label="Tổng việc (đã lọc)"
                    value={normalizedTasks.filter(task => {
                        if (filterStatus === "all") return true;
                        return task.status === filterStatus;
                    }).length}
                />
                {["confirmed", "in_progress", "waiting_for_payment", "completed"].map((status) => {
                    const config = statusConfig[status];
                    return (
                        <StatCard
                            key={status} icon={config.icon} color={config.color}
                            label={config.label} value={statusCounts[status] || 0}
                        />
                    );
                })}
            </div>

            {/* 🔍 FILTERS (GIAO DIỆN GIỐNG STAFF) */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* 1. Ô tìm kiếm */}
                <div className="relative flex-1 min-w-[280px]">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm Mã đơn, Biển số, Model, Tên KTV..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* 2. Lọc trạng thái */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="awaiting-customer-approval">Chờ khách duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="waiting-for-payment">Chờ thanh toán</option>
                    <option value="completed">Hoàn tất</option>
                </select>

                {/* 3. Lọc ngày (Theo ngày bắt đầu) */}
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* 📋 TASK LIST */}
            {normalizedTasks
                .filter(task => {
                    // 1. Lọc trạng thái
                    const matchStatus = filterStatus === "all" || task.status === filterStatus;

                    // 2. Lọc từ khóa (Mã, Biển số, Model, Tên KTV)
                    const lowerSearch = searchTerm.toLowerCase();
                    const matchSearch =
                        task.maintenanceID?.toString().includes(lowerSearch) ||
                        task.licensePlate?.toLowerCase().includes(lowerSearch) ||
                        task.model?.toLowerCase().includes(lowerSearch) ||
                        task.empName?.toLowerCase().includes(lowerSearch);

                    // 3. Lọc ngày (So sánh ngày bắt đầu)
                    const taskDate = getYmd(task.startTime); // Lấy ngày từ startTime
                    const matchDate = filterDate === "" || taskDate === filterDate;

                    return matchStatus && matchSearch && matchDate;
                })
                .map(task => (
                    <div
                        key={task.maintenanceID}
                        className={`rounded-2xl p-5 mb-5 border-2 shadow-md hover:shadow-lg transition-all duration-300 ${task.status === "in-progress"
                            ? "border-purple-500 bg-purple-50"
                            : task.status === "waiting-for-payment"
                                ? "border-orange-500 bg-orange-50"
                                : task.status === "completed"
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-200 bg-white"
                            }`}
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <Wrench className="w-5 h-5 text-gray-500" />
                                Bảo trì #{task.maintenanceID}
                            </h3>
                            <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${task.status === "in-progress"
                                        ? "bg-purple-100 text-purple-700"
                                        : task.status === "waiting-for-payment"
                                            ? "bg-orange-100 text-orange-700"
                                            : task.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {statusMapServerToUI[task.status.replace(/-/g, "_")]
                                    || statusMapServerToUI[task.status.replace(/-/g, " ")]
                                    || task.status}
                            </span>

                        </div>

                        {/* INFO GRID */}
                        <div className="text-sm text-gray-700 mb-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <div className="grid sm:grid-cols-2 divide-x divide-gray-200">
                                {/* Cột trái */}
                                <div className="p-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Kỹ thuật viên:</span>
                                        <span className="font-medium">{task.empName || "Chưa phân công"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Mẫu xe:</span>
                                        <span className="font-medium">{task.model}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Ngày đặt:</span>
                                        <span className="font-medium">
                                            {task.startTime ? new Date(task.startTime).toLocaleString("vi-VN") : "---"}
                                        </span>
                                    </div>
                                </div>

                                {/* Cột phải */}
                                <div className="p-3 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Biển số:</span>
                                        <span className="font-bold text-blue-600">{task.licensePlate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Chi phí:</span>
                                        <span className="font-medium text-green-600">
                                            {task.cost ? `${task.cost.toLocaleString()} đ` : "---"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Ghi chú:</span>
                                        <span className="truncate max-w-[150px]" title={task.notes}>{task.notes || "Không có"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {task.status === "confirmed" && (
                                <button onClick={() => handleStart(task.maintenanceID)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                                    <Play size={16} /> Bắt đầu
                                </button>
                            )}

                            {task.status === "in-progress" && (
                                <button onClick={() => navigate(`/technician/quotation/${task.maintenanceID}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                                    <FileText size={16} /> Tạo báo giá
                                </button>
                            )}

                            {(task.status === "awaiting-customer-approval" || task.status === "approved") && (
                                <button onClick={() => navigate(`/quotation/${task.maintenanceID}`)} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm px-4 py-2 rounded-lg shadow-sm border border-indigo-300">
                                    Xem báo giá
                                </button>
                            )}

                            {task.status === "approved" && (
                                <button onClick={() => handleComplete(task.maintenanceID)} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                                    <CheckCircle size={16} /> Hoàn tất
                                </button>
                            )}
                        </div>
                    </div>
                ))}

            {/* NOTE MODAL & DETAIL MODAL (Giữ nguyên như cũ) */}
            {noteModal && selectedTask && (
                <Modal title="Thêm ghi chú" onClose={() => setNoteModal(false)}>
                    <textarea
                        rows={3}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Nhập ghi chú..."
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end mt-4 gap-2">
                        <button onClick={() => setNoteModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Hủy</button>
                        <button onClick={handleSaveNote} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Lưu</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, color, label, value }) => (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
        <div className={`bg-${color}-100 p-3 rounded-xl mr-4`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <p className="text-gray-600 text-sm">{label}</p>
        </div>
    </div>
);

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <button onClick={onClose}><XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    </div>
);

export default TechnicianDashboard;
