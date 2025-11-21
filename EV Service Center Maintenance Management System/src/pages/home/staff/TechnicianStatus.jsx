import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle, Clock, User, Building2, MapPin, Filter } from 'lucide-react';

const TechnicianStatus = () => {
    const [allTechnicians, setAllTechnicians] = useState([]); // Dữ liệu gốc
    const [filteredTechnicians, setFilteredTechnicians] = useState([]); // Dữ liệu hiển thị
    const [serviceCenters, setServiceCenters] = useState([]);
    const [selectedCenter, setSelectedCenter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // 1. Lấy danh sách Service Centers
                const centersRes = await axios.get('http://localhost:8080/api/service-centers/getAll', { headers });
                const centersData = centersRes.data || [];
                setServiceCenters(centersData);

                // 2. Lấy danh sách Technician
                const techListRes = await axios.get('http://localhost:8080/api/employees/all/technicians', { headers });
                const techList = techListRes.data["List Of Technicians"] || [];

                // 3. Lấy chi tiết công việc cho từng Technician
                const techWithStatsPromises = techList.map(async (tech) => {
                    try {
                        const maintenanceRes = await axios.get(
                            `http://localhost:8080/api/maintenances/technician/${tech.employeeID}`,
                            { headers }
                        );

                        const maintenances = maintenanceRes.data.Maintenances || [];

                        const completedCount = maintenances.filter(m =>
                            m.status === 'Completed' || m.status === 'Finished'
                        ).length;

                        const currentCount = maintenances.filter(m =>
                            ['In Progress', 'Pending', 'Assigned', 'Waiting For Payment'].includes(m.status)
                        ).length;

                        // Lấy thông tin chi nhánh của technician
                        let branchId = tech.serviceCenterID; // Lấy trực tiếp ID
                        let branchName = tech.serviceCenterName; // Lấy trực tiếp Tên
                        if (!branchId && tech.serviceCenter) {
                            branchId = tech.serviceCenter.serviceCenterID || tech.serviceCenter.id;
                            branchName = tech.serviceCenter.name || tech.serviceCenter.address;
                        }

                        return {
                            ...tech,
                            completedCount,
                            currentCount,
                            totalJobs: maintenances.length,
                            branchId: branchId || null, 
                            branchName: branchName || "Chưa phân bổ"
                        };
                    } catch (err) {
                        console.error(`Lỗi tech ${tech.employeeID}`, err);
                        return { ...tech, completedCount: 0, currentCount: 0, totalJobs: 0 };
                    }
                });

                const finalData = await Promise.all(techWithStatsPromises);
                setAllTechnicians(finalData);
                setFilteredTechnicians(finalData);

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Xử lý khi chọn Dropdown
    useEffect(() => {
        if (selectedCenter === 'all') {
            setFilteredTechnicians(allTechnicians);
        } else {
            const filtered = allTechnicians.filter(tech =>
                // So sánh ID
                String(tech.branchId) === String(selectedCenter)
            );
            setFilteredTechnicians(filtered);
        }
    }, [selectedCenter, allTechnicians]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
                <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            {/* Header & Filter Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Wrench className="text-blue-600" />
                    Trạng thái Kỹ thuật viên
                </h2>

                {/* Bộ lọc Chi nhánh */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Filter size={20} />
                        <span className="font-medium">Lọc theo chi nhánh:</span>
                    </div>
                    <select
                        className="select select-bordered w-full md:w-64 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedCenter}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                    >
                        <option value="all">Tất cả chi nhánh</option>
                        {serviceCenters.map(center => (
                            <option key={center.serviceCenterID} value={center.serviceCenterID}>
                                {center.name || center.address}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid Kỹ thuật viên */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechnicians.map((tech) => (
                    <div key={tech.employeeID} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100">

                        {/* Header Card */}
                        <div className="flex items-center space-x-4 mb-4 border-b pb-4 border-dashed border-gray-200">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {tech.name ? tech.name.charAt(0).toUpperCase() : "T"}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{tech.name}</h3>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <User size={12} /> ID: {tech.employeeID}
                                    </p>
                                    {/* Hiển thị tên chi nhánh */}
                                    <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md w-fit">
                                        <MapPin size={12} /> {tech.branchName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex flex-col items-center">
                                <span className="text-2xl font-bold text-amber-600">{tech.currentCount}</span>
                                <div className="text-xs text-amber-700 font-medium flex items-center gap-1 mt-1">
                                    <Clock size={14} /> Đang xử lý
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex flex-col items-center">
                                <span className="text-2xl font-bold text-emerald-600">{tech.completedCount}</span>
                                <div className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1">
                                    <CheckCircle size={14} /> Hoàn thành
                                </div>
                            </div>
                        </div>

                        {/* Footer Card */}
                        <div className="flex justify-between items-center text-xs text-gray-400 pt-2">
                            <span>Tổng đơn: {tech.totalJobs}</span>
                            <span className={tech.currentCount > 0 ? "text-green-500 flex items-center gap-1" : "text-gray-400"}>
                                <span className={`w-2 h-2 rounded-full ${tech.currentCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                {tech.currentCount > 0 ? "Đang bận" : "Sẵn sàng"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredTechnicians.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                    <User size={48} className="mb-3 opacity-20" />
                    <p>Không tìm thấy kỹ thuật viên nào thuộc chi nhánh này.</p>
                </div>
            )}
        </div>
    );
};

export default TechnicianStatus;