import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo bạn đã config axios instance hoặc import axios
import { Wrench, CheckCircle, Clock, User } from 'lucide-react';

const TechnicianStatus = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTechnicianData();
    }, []);

    const fetchTechnicianData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Lấy danh sách tất cả Technician
            // (Dựa vào EmployeeController: /api/employees/all/technicians)
            const techListRes = await axios.get('http://localhost:8080/api/employees/all/technicians', { headers });
            const techList = techListRes.data["List Of Technicians"] || [];

            // 2. Với mỗi technician, gọi API maintenance để lấy danh sách đơn hàng
            const techWithStatsPromises = techList.map(async (tech) => {
                try {
                    // API BẠN YÊU CẦU: /api/maintenances/technician/{technicianId}
                    const maintenanceRes = await axios.get(
                        `http://localhost:8080/api/maintenances/technician/${tech.employeeID}`, 
                        { headers }
                    );
                    
                    const maintenances = maintenanceRes.data.Maintenances || [];

                    // 3. Tính toán số lượng dựa trên status
                    // Giả sử status trong DB là: "Completed", "In Progress", "Pending", v.v.
                    const completedCount = maintenances.filter(m => 
                        m.status === 'Completed' || m.status === 'Finished'
                    ).length;

                    const currentCount = maintenances.filter(m => 
                        ['In Progress', 'Pending', 'Assigned', 'Waiting For Payment'].includes(m.status)
                    ).length;

                    return {
                        ...tech,
                        completedCount,
                        currentCount,
                        totalJobs: maintenances.length
                    };
                } catch (err) {
                    console.error(`Lỗi khi lấy maintenance cho tech ${tech.employeeID}`, err);
                    return { ...tech, completedCount: 0, currentCount: 0, totalJobs: 0 };
                }
            });

            const techWithStats = await Promise.all(techWithStatsPromises);
            setTechnicians(techWithStats);

        } catch (error) {
            console.error("Lỗi tải danh sách kỹ thuật viên:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><span className="loading loading-spinner text-blue-500"></span>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Wrench className="text-blue-600" />
                Trạng thái Kỹ thuật viên
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicians.map((tech) => (
                    <div key={tech.employeeID} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
                        
                        {/* Header Card: Avatar & Tên */}
                        <div className="flex items-center space-x-4 mb-4 border-b pb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                {tech.name ? tech.name.charAt(0).toUpperCase() : "T"}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">{tech.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <User size={14}/> ID: {tech.employeeID}
                                </p>
                            </div>
                        </div>

                        {/* Thống kê */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-yellow-50 p-3 rounded-lg text-center">
                                <p className="text-sm text-yellow-700 font-medium mb-1 flex justify-center items-center gap-1">
                                    <Clock size={16}/> Đang làm
                                </p>
                                <span className="text-2xl font-bold text-yellow-600">{tech.currentCount}</span>
                            </div>

                            <div className="bg-green-50 p-3 rounded-lg text-center">
                                <p className="text-sm text-green-700 font-medium mb-1 flex justify-center items-center gap-1">
                                    <CheckCircle size={16}/> Đã xong
                                </p>
                                <span className="text-2xl font-bold text-green-600">{tech.completedCount}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t text-center">
                            <span className="text-xs text-gray-400">Tổng khối lượng công việc: {tech.totalJobs} đơn</span>
                        </div>
                    </div>
                ))}
            </div>

            {technicians.length === 0 && (
                <div className="text-center text-gray-500 py-10">Không tìm thấy kỹ thuật viên nào.</div>
            )}
        </div>
    );
};

export default TechnicianStatus;