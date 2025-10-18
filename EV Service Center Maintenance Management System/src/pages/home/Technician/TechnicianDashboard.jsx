import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Wrench, CheckCircle, FileText,
    Play, User, Phone, MapPin, XCircle, Activity
} from 'lucide-react';
import api from '../../../../api'; // ✅ để bạn nối API thật
import { statusMapServerToUI, statusMapUIToServer } from "../../../utils/statusHelpers";

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [noteModal, setNoteModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [newNote, setNewNote] = useState('');


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
        const interval = setInterval(fetchTasks, 10000);
        return () => clearInterval(interval);
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
            alert(`✅ Đơn ${maintenanceID} đã chuyển sang "Đang thực hiện"`);
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
            alert(`🏁 Đơn ${maintenanceID} đã chuyển sang "Chờ thanh toán"`);
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
    const assigned = tasks.filter(t => t.status === 'assigned');
    const inProgress = tasks.filter(t => t.status === 'in_progress');
    const completed = tasks.filter(t => t.status === 'completed');

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

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Calendar} color="blue" label="Công việc hôm nay" value={todayTasks.length} />
                <StatCard icon={Clock} color="yellow" label="Chờ xử lý" value={assigned.length} />
                <StatCard icon={Wrench} color="purple" label="Đang thực hiện" value={inProgress.length} />
                <StatCard icon={CheckCircle} color="green" label="Hoàn tất" value={completed.length} />
            </div>


            return (
            <>
                {/* TASK LIST */}
                {normalizedTasks.map(task => (
                    console.log("task status:", task.status, "for", task.maintenanceID),
                    <div key={task.maintenanceID} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                        <div className="flex justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Bảo trì #{task.maintenanceID}</h3>
                            <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === "in-progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : task.status === "waiting-for-payment"
                                        ? "bg-orange-100 text-orange-700"
                                        : task.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {statusMapServerToUI[task.status] || task.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700 mb-4">
                            <p><strong>Kỹ thuật viên:</strong> {task.empName}</p>
                            <p><strong>Biển số xe:</strong> {task.licensePlate}</p>
                            <p><strong>Mẫu xe:</strong> {task.model}</p>
                            <p><strong>Chi phí:</strong> {task.cost ? task.cost + " triệu" : "Chưa xác định"}</p>
                            <p>
                                <strong>Thời gian bắt đầu:</strong>{" "}
                                {task.startTime
                                    ? new Date(task.startTime).toLocaleString("vi-VN")
                                    : "Chưa bắt đầu"}
                            </p>
                            <p>
                                <strong>Thời gian kết thúc:</strong>{" "}
                                {task.endTime
                                    ? new Date(task.endTime).toLocaleString("vi-VN")
                                    : "Chưa hoàn tất"}
                            </p>
                            <p><strong>Ghi chú:</strong> {task.notes || "Không có"}</p>
                        </div>

                        {/* ✅ Nút thao tác */}
                        <div className="mt-4 flex gap-2">
                            {/* Khi chưa bắt đầu (pending hoặc confirmed) → hiện Bắt đầu */}
                            {["pending", "confirmed", "in-progress"].includes(task.status) && (
                                <button
                                    onClick={() => handleStart(task.maintenanceID)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                                >
                                    Bắt đầu
                                </button>
                            )}

                            {/* Khi đang thực hiện → hiện Hoàn tất */}
                            {task.status === "in-progress" && (
                                <button
                                    onClick={() => handleComplete(task.maintenanceID)}
                                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                                >
                                    Hoàn tất
                                </button>
                            )}

                            {/* Khi chờ thanh toán → hiện trạng thái */}
                            {task.status === "waiting-for-payment" && (
                                <span className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-lg">
                                    Chờ thanh toán
                                </span>
                            )}

                            {/* Khi hoàn tất → hiện trạng thái */}
                            {task.status === "completed" && (
                                <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg">
                                    Hoàn tất
                                </span>
                            )}
                        </div>

                    </div>
                ))}
            </>
            );

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
