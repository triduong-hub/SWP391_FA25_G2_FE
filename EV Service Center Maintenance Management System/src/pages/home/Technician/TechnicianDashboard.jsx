import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, Wrench, CheckCircle, FileText,
    Play, User, Phone, MapPin, XCircle, Activity
} from 'lucide-react';
import API from '../../../../api'; // ✅ để bạn nối API thật

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [noteModal, setNoteModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [newNote, setNewNote] = useState('');


    // useEffect(() => {
    //     const fetchTasks = async () => {
    //         try {
    //             const res = await API.get("/technician/tasks");
    //             setTasks(res.data); // Dữ liệu thật từ backend
    //         } catch (err) {
    //             console.error("❌ Lỗi khi lấy danh sách công việc:", err);
    //         }
    //     };

    //     fetchTasks();
    // }, []);
    useEffect(() => {
        // ✅ Khi có API thật, chỉ cần gọi:
        // API.get('/technician/tasks').then(res => setTasks(res.data));
        setTasks(mockTasks);
    }, []);

    // ---------------- MOCK DATA ----------------
    const mockTasks = [
        {
            id: 1,
            orderId: 'ORD001',
            customerName: 'Nguyễn Văn A',
            customerPhone: '0901234567',
            vehicle: 'Tesla Model 3 - 30A-12345',
            service: 'Battery Check',
            description: 'Kiểm tra tình trạng pin và hiệu suất sạc',
            date: '2024-01-20',
            time: '09:00',
            location: 'EVCare - Quận 1',
            status: 'Đã xác nhận',
            technicianNotes: [],
        },
        {
            id: 2,
            orderId: 'ORD002',
            customerName: 'Trần Thị B',
            customerPhone: '0907654321',
            vehicle: 'VinFast VF8 - 51G-67890',
            service: 'Motor Service',
            description: 'Kiểm tra và bảo dưỡng hệ thống động cơ điện',
            date: '2024-01-20',
            time: '10:30',
            location: 'EVCare - Quận 1',
            status: 'Đang thực hiện',
            technicianNotes: [{ time: '10:35', note: 'Bắt đầu kiểm tra hệ thống động cơ' }],
        },
    ];

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

    const formatDate = (date, time) => `${new Date(date).toLocaleDateString('vi-VN')} ${time}`;

    // ---------------- HANDLERS ----------------
    // Khi kỹ thuật viên bấm "Bắt đầu"
    const handleStart = async (id) => {
        try {
            // 🔹 Cập nhật giao diện ngay (UI phản hồi nhanh)
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Đang thực hiện' } : t));

            // 🔹 Gọi API thật khi backend có
            // await API.put(`/orders/${id}/start`);

            console.log(`✅ Đơn ${id} đã chuyển sang "Đang thực hiện"`);
        } catch (err) {
            console.error("❌ Lỗi khi bắt đầu công việc:", err);
            alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
        }
    };

    // Khi kỹ thuật viên bấm "Hoàn tất"
    const handleComplete = async (id) => {
        try {
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Hoàn thành' } : t));

            // 🔹 Gọi API thật khi backend có
            // await API.put(`/orders/${id}/complete`);

            console.log(`🏁 Đơn ${id} đã chuyển sang "Hoàn thành"`);
        } catch (err) {
            console.error("❌ Lỗi khi hoàn tất công việc:", err);
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

            {/* TASK LIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tasks.map(task => (
                    <div key={task.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                        <div className="flex justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{task.service}</h3>
                            {getStatusBadge(task.status)}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>

                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-400" />{task.customerName}</div>
                            <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400" />{task.customerPhone}</div>
                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" />{task.location}</div>
                            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400" />{formatDate(task.date, task.time)}</div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-2 mt-4">
                            {task.status === 'Đã xác nhận' && (
                                <button onClick={() => handleStart(task.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium">
                                    <Play className="inline w-4 h-4 mr-1" /> Bắt đầu
                                </button>
                            )}
                            {task.status === 'Đang thực hiện' && (
                                <button onClick={() => handleComplete(task.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium">
                                    <CheckCircle className="inline w-4 h-4 mr-1" /> Hoàn tất
                                </button>
                            )}
                            <button
                                onClick={() => { setSelectedTask(task); setNoteModal(true); }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium"
                            >
                                <FileText className="inline w-4 h-4 mr-1" /> Ghi chú
                            </button>
                            <button
                                onClick={() => { setSelectedTask(task); setDetailModal(true); }}
                                className="px-3 py-2 text-sm font-medium text-blue-600 hover:underline"
                            >
                                Chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
