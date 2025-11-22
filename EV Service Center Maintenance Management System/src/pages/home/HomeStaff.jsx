import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Award, X, CheckCircle } from "lucide-react";
import api from "../../../api";

const HomeStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  
  // Form data cho Nhân viên
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phone: "",
    email: "",
    gender: "",
    role: "staff",
    serviceCenter: "",
    shift: "",
    salary: "",
    address: "",
    birth: "",
  });

  // State cho Chứng chỉ EV (Chỉ dành cho Technician)
  const [showCertModal, setShowCertModal] = useState(false);
  const [pendingCerts, setPendingCerts] = useState([]); // Danh sách cert chưa lưu vào DB
  const [certFormData, setCertFormData] = useState({
    certificateName: "",
    issuedBy: "",
    level: "",
    issuedDate: "",
    expirationDate: "",
  });

  const [serviceCenters, setServiceCenters] = useState([]);
  const [shifts, setShifts] = useState([]);

  // 🧾 Lấy danh sách nhân viên
  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employees");
      const list = res.data["List Of Employees"] || [];
      const sorted = list.sort((a, b) => a.employeeID - b.employeeID);
      setStaffList(sorted);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
    
    // Load phụ trợ
    const loadResources = async () => {
        try {
            const [resCenters, resShifts] = await Promise.all([
                api.get("/service-centers/getAll"),
                api.get("/shifts/getAll")
            ]);
            setServiceCenters(resCenters.data || []);
            setShifts(resShifts.data || []);
        } catch (err) {
            console.error("Lỗi tải resource:", err);
        }
    }
    loadResources();
  }, []);

  // --- LOGIC CHỨNG CHỈ ---
  const handleAddCertToLocal = () => {
    if (!certFormData.certificateName || !certFormData.level) {
      alert("Vui lòng nhập tên chứng chỉ và cấp độ!");
      return;
    }
    // Thêm vào danh sách tạm (chưa gọi API)
    setPendingCerts([...pendingCerts, { ...certFormData, id: Date.now() }]); // id tạm để key
    setShowCertModal(false);
    // Reset form cert
    setCertFormData({
      certificateName: "",
      issuedBy: "",
      level: "",
      issuedDate: "",
      expirationDate: "",
    });
  };

  const handleRemovePendingCert = (tempId) => {
    setPendingCerts(pendingCerts.filter(c => c.id !== tempId));
  };

  // --- LOGIC LƯU NHÂN VIÊN ---
  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert("Vui lòng nhập đủ thông tin nhân viên");
      return;
    }

    try {
      let savedEmployeeId;

      // 1. Lưu/Sửa thông tin nhân viên trước
      const payload = {
        name: formData.name,
        password: formData.password || "123456",
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        role: formData.role,
        serviceCenter: Number(formData.serviceCenter) || 0,
        shift: Number(formData.shift) || 0,
        salary: Number(formData.salary) || 0,
        address: formData.address,
        birth: formData.birth ? (formData.birth.includes('T') ? formData.birth : `${formData.birth}T00:00:00`) : null,
      };

      if (editingStaff) {
        await api.put(`/employees/update/${editingStaff.employeeID}`, payload);
        savedEmployeeId = editingStaff.employeeID;
      } else {
        const res = await api.post("/employees/register", payload);
        // Giả sử API trả về object nhân viên vừa tạo có employeeID
        savedEmployeeId = res.data.employeeID || res.data.id; 
      }

      // 2. Nếu là Technician và có chứng chỉ pending, gọi API tạo chứng chỉ
      if (formData.role === 'technician' && pendingCerts.length > 0 && savedEmployeeId) {
        const certPromises = pendingCerts.map(cert => {
            const certPayload = {
                certificateName: cert.certificateName,
                issuedBy: cert.issuedBy,
                level: cert.level,
                issuedDate: cert.issuedDate || null,
                expirationDate: cert.expirationDate || null,
                active: true,
                employeeID: savedEmployeeId
            };
            return api.post("/ev-certifications/create", certPayload);
        });
        await Promise.all(certPromises);
      }

      // 3. Refresh và Reset
      await fetchStaffData();
      setShowForm(false);
      setEditingStaff(null);
      setPendingCerts([]); // Clear certs
      setFormData({
        name: "",
        password: "",
        phone: "",
        email: "",
        gender: "",
        role: "staff",
        serviceCenter: "",
        shift: "",
        salary: "",
        address: "",
        birth: "",
      });

    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      alert("Có lỗi xảy ra: " + (err.response?.data?.message || err.message));
    }
  };

  //  Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này không?")) {
      try {
        await api.delete(`/employees/delete/${id}`);
        setStaffList(staffList.filter((s) => s.employeeID !== id));
      } catch (err) {
        console.error("Lỗi xóa:", err);
      }
    }
  };

  // 🔍 Tìm kiếm + Lọc
  const filteredStaff = staffList.filter((s) => {
    const matchSearch = [s.name, s.email, s.role].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = filterStatus === "all" || (s.status ? "Đang làm việc" : "Nghỉ việc") === filterStatus;
    return matchSearch && matchStatus;
  });

  // Hàm mở form thêm/sửa (Reset pending certs khi mở form mới)
  const openForm = (staff = null) => {
      setEditingStaff(staff);
      setPendingCerts([]); // Reset danh sách cert tạm thời
      
      if (staff) {
          setFormData({
            name: staff.name || "",
            password: "",
            phone: staff.phone || "",
            email: staff.email || "",
            gender: staff.gender || "",
            role: staff.role || "staff",
            serviceCenter: staff.serviceCenter || "",
            shift: staff.shift || "",
            salary: staff.salary || "",
            address: staff.address || "",
            birth: staff.birth ? staff.birth.split("T")[0] : "",
          });
          // Nếu cần load cert cũ của nhân viên này để edit, cần gọi API getCertByEmployeeID ở đây
          // Nhưng theo yêu cầu hiện tại tập trung vào "Thêm nhân viên", ta để trống pendingCerts
      } else {
          setFormData({
            name: "", password: "", phone: "", email: "", gender: "",
            role: "staff", serviceCenter: "", shift: "", salary: "", address: "", birth: "",
          });
      }
      setShowForm(true);
  }

  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 min-h-screen rounded-2xl space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">👥 Quản lý Nhân viên</h2>

      {/* Bộ công cụ */}
      <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center border border-gray-300 rounded px-3 py-2 w-80 focus-within:ring-2 focus-within:ring-emerald-500">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            className="w-full outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="Đang làm việc">Đang làm việc</option>
          <option value="Nghỉ việc">Nghỉ việc</option>
        </select>

        <button
          onClick={() => openForm(null)}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm nhân viên
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4 text-gray-500">⏳ Đang tải dữ liệu...</p>
        ) : (
          <table className="w-full border-collapse text-gray-900 table-fixed">
            <thead>
              <tr className="bg-emerald-50 text-gray-700 text-sm uppercase border-b">
                <th className="p-3 text-center w-[5%]">ID</th>
                <th className="p-3 text-left w-[25%]">Họ và tên</th>
                <th className="p-3 text-left w-[25%]">Email</th>
                <th className="p-3 text-left w-[15%]">Vai trò</th>
                <th className="p-3 text-center w-[15%]">Trạng thái</th>
                <th className="p-3 text-center w-[15%]">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">⚠️ Không có dữ liệu.</td>
                </tr>
              ) : (
                filteredStaff.map((item) => (
                  <tr key={item.employeeID} className="border-b hover:bg-emerald-50/50 transition">
                    <td className="p-3 text-center">{item.employeeID}</td>
                    <td className="p-3 text-left">{item.name}</td>
                    <td className="p-3 text-left">{item.email}</td>
                    <td className="p-3 text-left capitalize">{item.role}</td>
                    <td className={`p-3 text-center font-medium ${item.status ? "text-green-600" : "text-red-500"}`}>
                      {item.status ? "Đang làm việc" : "Nghỉ việc"}
                    </td>
                    <td className="px-4 py-2 flex justify-center space-x-3">
                      <button
                        onClick={() => openForm(item)}
                        className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.employeeID)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL THÊM / SỬA NHÂN VIÊN */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl shadow-2xl border border-gray-200 flex flex-col relative">
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              {editingStaff ? "✏️ Sửa nhân viên" : "➕ Thêm nhân viên"}
            </h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-4">
              {/* Các trường cơ bản */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhân viên:</label>
                <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input type="email" className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu:</label>
                <input type="password" placeholder={editingStaff ? "Để trống nếu không đổi" : ""}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:</label>
                <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính:</label>
                <select className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trung tâm dịch vụ:</label>
                <select className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.serviceCenter} onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })}>
                  <option value="">Chọn trung tâm</option>
                  {serviceCenters.map((center) => (
                    <option key={center.serviceCenterID} value={center.serviceCenterID}>{center.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ca làm việc:</label>
                <select className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })}>
                  <option value="">Chọn ca</option>
                  {shifts.map((shift) => (
                    <option key={shift.shiftID} value={shift.shiftID}>{shift.name} ({shift.start_time}-{shift.end_time})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
                <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh:</label>
                <input type="date" className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.birth} onChange={(e) => setFormData({ ...formData, birth: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò:</label>
                <select className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="staff">Staff</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* PHẦN CHỨNG CHỈ CHO TECHNICIAN */}
            {formData.role === 'technician' && (
                <div className="mt-6 px-4 border-t pt-4 border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Award className="text-blue-600 w-5 h-5"/> Chứng chỉ EV & Kỹ năng
                        </h4>
                        <button 
                            onClick={() => setShowCertModal(true)}
                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 flex items-center gap-1"
                        >
                            <Plus size={14}/> Thêm chứng chỉ
                        </button>
                    </div>

                    {pendingCerts.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Chưa có chứng chỉ nào được thêm.</p>
                    ) : (
                        <div className="grid gap-2">
                            {pendingCerts.map((cert) => (
                                <div key={cert.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{cert.certificateName}</p>
                                        <p className="text-xs text-gray-500">{cert.issuedBy} • Level: {cert.level}</p>
                                    </div>
                                    <button onClick={() => handleRemovePendingCert(cert.id)} className="text-red-400 hover:text-red-600">
                                        <X size={16}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end space-x-3 mt-6 px-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:opacity-90 shadow">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NHẬP CHỨNG CHỈ RIÊNG */}
      {showCertModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
              <div className="bg-white rounded-xl p-6 w-96 shadow-2xl animate-in fade-in zoom-in duration-200">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                      <Award className="text-yellow-500"/> Thêm Chứng Chỉ
                  </h3>
                  <div className="space-y-3">
                      <input 
                        type="text" placeholder="Tên chứng chỉ (VD: High Voltage L1)" 
                        className="w-full border p-2 rounded"
                        value={certFormData.certificateName}
                        onChange={(e) => setCertFormData({...certFormData, certificateName: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Cấp bởi (VD: VinFast, Toyota)" 
                        className="w-full border p-2 rounded"
                        value={certFormData.issuedBy}
                        onChange={(e) => setCertFormData({...certFormData, issuedBy: e.target.value})}
                      />
                      <select 
                        className="w-full border p-2 rounded"
                        value={certFormData.level}
                        onChange={(e) => setCertFormData({...certFormData, level: e.target.value})}
                      >
                          <option value="">Chọn cấp độ</option>
                          <option value="Level 1">Level 1</option>
                          <option value="Level 2">Level 2</option>
                          <option value="Level 3">Level 3</option>
                          <option value="Specialist">Specialist</option>
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <label className="text-xs text-gray-500">Ngày cấp</label>
                              <input 
                                type="date" className="w-full border p-2 rounded text-sm"
                                value={certFormData.issuedDate}
                                onChange={(e) => setCertFormData({...certFormData, issuedDate: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500">Ngày hết hạn</label>
                              <input 
                                type="date" className="w-full border p-2 rounded text-sm"
                                value={certFormData.expirationDate}
                                onChange={(e) => setCertFormData({...certFormData, expirationDate: e.target.value})}
                              />
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-5">
                      <button onClick={() => setShowCertModal(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Đóng</button>
                      <button onClick={handleAddCertToLocal} className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1">
                          <CheckCircle size={14}/> Thêm
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default HomeStaff;