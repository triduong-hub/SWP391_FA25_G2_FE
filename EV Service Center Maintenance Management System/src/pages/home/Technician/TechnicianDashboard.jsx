import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Wrench, CheckCircle, FileText,
    Play, User, Phone, MapPin, XCircle, Activity
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
    const navigate = useNavigate();



    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get("/maintenances/all");
                console.log("📦 Dữ liệu bảo trì:", res.data);
                setTasks(Array.isArray(res.data.Maintenances) ? res.data.Maintenances : []);
            } catch (err) {
                console.error("❌ Lỗi khi lấy danh sách công việc:", err);
            }
        };

        fetchTasks();

        // 🔁 Cập nhật tự động mỗi 10 giây
        // const interval = setInterval(fetchTasks, 10000);
        // return () => clearInterval(interval);
    }
        , []);

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

    const normalizedTasks = tasks.map((t) => {
        return {
            ...t,
            status: t.status ? t.status.toLowerCase().replace(/\s+/g, "-") : "",
        };
    });

    const formatDate = (date, time) => `${new Date(date).toLocaleDateString('vi-VN')} ${time}`;

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
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
                    <p className="text-gray-500">Quản lý công việc được phân công</p>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <Activity className="w-4 h-4 mr-2" />
                    {new Date().toLocaleTimeString('vi-VN')}
                </div>
            </div>

            {/* FILTER */}
            <div className="mb-6 flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="waiting_for_payment">Chờ thanh toán</option>
                    <option value="completed">Hoàn tất</option>
                </select>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Công việc hôm nay (cố định) */}
                <StatCard
                    icon={Calendar}
                    color="blue"
                    label="Tổng đơn (đã lọc)"
                    value={
                        normalizedTasks.filter(task => {
                            if (filterStatus === "all") return true;
                            const normalized = (task.status || "")
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "_")
                                .replace(/^_+|_+$/g, "");
                            return normalized === filterStatus;
                        }).length
                    }
                />

                {/* Tự động hiển thị các trạng thái thật từ dữ liệu */}
                {/* Luôn hiển thị đủ các trạng thái chính */}
                {["confirmed", "in_progress", "waiting_for_payment", "completed"].map((status) => {
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    const count = statusCounts[status] || 0;
                    return (
                        <StatCard
                            key={status}
                            icon={Icon}
                            color={config.color}
                            label={config.label}
                            value={count}
                        />
                    );
                })}

            </div>




            {/* TASK LIST */}
            {normalizedTasks
                .filter(task => {
                    if (filterStatus === "all") return true;

                    // chuẩn hoá status trước khi so sánh
                    const normalized = (task.status || "")
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "_")
                        .replace(/^_+|_+$/g, "");
                    return normalized === filterStatus;
                })
                .map(task => (
                    console.log("task status:", task.status, "for", task.maintenanceID),
                    <div
                        key={task.maintenanceID}
                        className={`rounded-2xl p-5 mb-5 border-2 shadow-md hover:shadow-lg transition-all duration-300 ${task.status === "in-progress"
                            ? "border-purple-500 bg-purple-50"
                            : task.status === "waiting-for-payment"
                                ? "border-orange-500 bg-orange-50"
                                : task.status === "completed"
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-300 bg-white"
                            }`}
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 text-lg">
                                Bảo trì #{task.maintenanceID}
                            </h3>
                            <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${task.status === "in-progress"
                                    ? "bg-purple-100 text-purple-700"
                                    : task.status === "waiting-for-payment"
                                        ? "bg-orange-100 text-orange-700"
                                        : task.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {statusMapServerToUI[task.status?.toLowerCase()?.replace(/-/g, " ")] ||
                                    task.status}
                            </span>
                        </div>

                        {/* INFO */}
                        {/* INFO */}
                        <div className="text-sm text-gray-700 mb-4 border border-gray-200 rounded-xl overflow-hidden">
                            <div className="grid sm:grid-cols-2 divide-x divide-gray-200">
                                {/* Cột trái */}
                                <div className="p-3 divide-y divide-gray-200">
                                    <div className="py-1">
                                        <p className="font-medium">Kỹ thuật viên:</p>
                                        <p>{task.empName}</p>
                                    </div>
                                    <div className="py-1">
                                        <p className="font-medium">Mẫu xe:</p>
                                        <p>{task.model}</p>
                                    </div>
                                    <div className="py-1">
                                        <p className="font-medium">Bắt đầu:</p>
                                        <p>
                                            {task.startTime
                                                ? new Date(task.startTime).toLocaleString("vi-VN")
                                                : "Chưa bắt đầu"}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <p className="font-medium">Ghi chú:</p>
                                        <p>{task.notes || "Không có"}</p>
                                    </div>
                                </div>

                                {/* Cột phải */}
                                <div className="p-3 divide-y divide-gray-200">
                                    <div className="py-1">
                                        <p className="font-medium">Biển số xe:</p>
                                        <p>{task.licensePlate}</p>
                                    </div>
                                    <div className="py-1">
                                        <p className="font-medium">Chi phí:</p>
                                        <p>{task.cost ? `${task.cost} triệu` : "Chưa xác định"}</p>
                                    </div>
                                    <div className="py-1">
                                        <p className="font-medium">Kết thúc:</p>
                                        <p>
                                            {task.endTime
                                                ? new Date(task.endTime).toLocaleString("vi-VN")
                                                : "Chưa hoàn tất"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* ACTION BUTTONS */}
                        {/* <div className="mt-3 flex gap-2">
                            {["pending", "confirmed"].includes(task.status) && (
                                <button
                                    onClick={() => handleStart(task.maintenanceID)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                                >
                                    Bắt đầu
                                </button>
                            )}

                            {task.status === "in-progress" && (
                                <button
                                    onClick={() => handleComplete(task.maintenanceID)}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                                >
                                    Hoàn tất
                                </button>
                            )}

                            {task.status === "waiting-for-payment" && (
                                <span className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-lg text-sm">
                                    Chờ thanh toán
                                </span>
                            )}

                            {task.status === "completed" && (
                                <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg text-sm">
                                    Hoàn tất
                                </span>
                            )}
                        </div> */}
                        {/* ACTION BUTTONS */}
                        <div className="mt-3 flex gap-2">
                            {/* ✅ Khi đã xác nhận (staff phân công xong) */}
                            {task.status === "confirmed" && (
                                <button
                                    onClick={() => handleStart(task.maintenanceID)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                                >
                                    Bắt đầu
                                </button>
                            )}

                            {/* ✅ Khi đang thực hiện */}
                            {task.status === "in-progress" && (
                                <>
                                    <button
                                        onClick={() => navigate(`/technician/quotation/${task.maintenanceID}`)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                                    >
                                        🧾 Tạo báo giá
                                    </button>
                                </>
                            )}

                            {/* ✅ Khi đã báo giá xong, chờ khách xác nhận */}
                            {task.status === "awaiting_customer_approval" && (
                                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                    <span className="text-yellow-700 font-medium">
                                        Chờ khách xác nhận báo giá
                                    </span>
                                    <button
                                        onClick={() => navigate(`/quotation/${task.maintenanceID}`)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                                    >
                                        Xem báo giá
                                    </button>
                                </div>
                            )}

                            {/* ✅ Khi khách đã xác nhận báo giá → kỹ thuật viên thực hiện lại */}
                            {task.status === "approved" && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate(`/quotation/${task.maintenanceID}`)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                                    >
                                        Xem báo giá
                                    </button>

                                    <button
                                        onClick={() => handleComplete(task.maintenanceID)}
                                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm"
                                    >
                                        Hoàn tất
                                    </button>
                                </div>
                            )}


                            {/* ✅ Khi chờ thanh toán */}
                            {task.status === "waiting-for-payment" && (
                                <>
                                    <span className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-lg text-sm">
                                        Chờ thanh toán
                                    </span>

                                </>
                            )}

                            {/* ✅ Khi hoàn tất */}
                            {task.status === "completed" && (
                                <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg text-sm">
                                    Hoàn thành
                                </span>
                            )}
                        </div>


                    </div>

                ))}

            {/* NOTE MODAL */}
            {noteModal && selectedTask && (
                <Modal title="Thêm ghi chú" onClose={() => setNoteModal(false)}>
                    <p className="mb-3 font-medium text-gray-800">{selectedTask.service}</p>
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

            {/* DETAIL MODAL */}
            {detailModal && selectedTask && (
                <Modal title="Chi tiết công việc" onClose={() => setDetailModal(false)}>
                    <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Dịch vụ:</strong> {selectedTask.service}</p>
                        <p><strong>Khách hàng:</strong> {selectedTask.customerName}</p>
                        <p><strong>Xe:</strong> {selectedTask.vehicle}</p>
                        <p><strong>Địa điểm:</strong> {selectedTask.location}</p>
                        <p><strong>Thời gian:</strong> {formatDate(selectedTask.date, selectedTask.time)}</p>
                        {selectedTask.technicianNotes.length > 0 && (
                            <div className="mt-3">
                                <p className="font-semibold text-gray-800 mb-1">Ghi chú kỹ thuật:</p>
                                {selectedTask.technicianNotes.map((n, i) => (
                                    <p key={i} className="text-gray-600">{n.time}: {n.note}</p>
                                ))}
                            </div>
                        )}
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
