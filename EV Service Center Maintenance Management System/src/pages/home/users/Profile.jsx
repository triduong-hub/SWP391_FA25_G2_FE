import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, UserCircle, Edit3, Save, X, Briefcase, MapPin, Calendar, Car, Clock, Building2, Award, ChevronRight } from "lucide-react";
import API from '../../../../api';


const ALL_EMPLOYEE_ROLES = ['staff', 'technician', 'admin'];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Data States
  const [shifts, setShifts] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false); 

  const userId = user?.userID;
  const userRole = user?.role?.toLowerCase() || 'customer';
  const isEmployee = ALL_EMPLOYEE_ROLES.includes(userRole);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const role = storedUser.role?.toLowerCase() || 'customer';
      // PHẠM VI MỚI: isEmployee chỉ dùng để tính toán giá trị khởi tạo
      const isUserEmployee = ALL_EMPLOYEE_ROLES.includes(role);

      const initialUser = {
        // Customer fields
        ...storedUser,
        role: role,
        // Employee/Admin specific fields (MOCK DATA)
        serviceCenter: storedUser.serviceCenter || '',
        shift: storedUser.shift || '',
        address: storedUser.address || '',
        birth: storedUser.birth || '',
      };

      setUser(initialUser);
      // Khởi tạo formData với dữ liệu hiện tại
      setFormData({
        name: initialUser.name || '',
        phone: initialUser.phone || '',
        gender: initialUser.gender || 'unknown',
        address: initialUser.address || '',
        birth: initialUser.birth || '',
        // Fields đặc thù cho Employee/Admin
        role: initialUser.role || 'customer',
        serviceCenter: initialUser.serviceCenter || '',
        shift: initialUser.shift || '',
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (isEmployee && user) {
      const fetchData = async () => {
        try {
          const reqs = [
            API.get('/shifts/getAll'),
            API.get('/service-centers/getAll')
          ];

          // Nếu là technician, thêm request lấy chứng chỉ vào vị trí thứ 3 (index 2)
          if (userRole === 'technician' && userId) {
            reqs.push(API.get(`/ev-certifications/employee/${userId}`));
          }
          const results = await Promise.all(reqs);

          // Gán dữ liệu cơ bản
          setShifts(results[0]?.data || []);
          setServiceCenters(results[1]?.data || []);
          if (results[2]) {
            setCertifications(results[2].data || []);
          }

        } catch (error) {
          console.error("Lỗi tải dữ liệu profile:", error);
        }
      };
      fetchData();
    }
  }, [isEmployee, userRole, userId, user]);

  // Hàm lấy tên ca từ ID
  const getShiftName = (shiftId) => {
    if (!shiftId) return "Chưa phân công";
    // Tìm trong mảng shifts xem ca nào có ID trùng
    const foundShift = shifts.find(s => s.shiftID === shiftId);
    if (foundShift) {
      // Hiển thị Tên + Giờ (nếu có)
      const timeStr = foundShift.start_time ? ` (${foundShift.start_time} - ${foundShift.end_time})` : '';
      return `${foundShift.name}${timeStr}`;
    }
    return `Ca số ${shiftId}`; // Fallback nếu chưa load được danh sách
  };

  const getServiceCenterName = (centerId) => {
    if (!centerId) return "Chưa phân công";
    const foundCenter = serviceCenters.find(s =>
      String(s.serviceCenterID) === String(centerId)
    );

    if (foundCenter) return foundCenter.name;
    if (serviceCenters.length === 0) return "Đang tải dữ liệu...";
    return `Trung tâm #${centerId} (Không tồn tại)`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">
          Đang tải thông tin người dùng...
        </p>
      </div>
    );
  }

  const getGenderText = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return "Không xác định";
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!userId) {
      setLoading(false);
      setMessage({ type: 'error', text: 'Không tìm thấy ID người dùng để cập nhật.' });
      return;
    }

    // 1. Xác định Endpoint dựa trên vai trò (ĐÃ CẬP NHẬT LOGIC ADMIN)
    let endpointPrefix = '';
    if (userRole === 'customer') {
      endpointPrefix = '/customer/update';
    } else if (userRole === 'admin') {
      endpointPrefix = '/admin/update';
    } else {
      // staff, tech (Employee chung)
      endpointPrefix = '/employees/update';
    }
    const endpoint = `${endpointPrefix}/${userId}`;

    // 2. Chuẩn bị Payload (chỉ gửi những trường thay đổi)
    const payload = {};
    let fieldsChanged = 0;

    // Các trường cơ bản (Customer)
    const fieldsToCompare = ['name', 'phone', 'gender', 'address', 'birth'];

    // Thêm các trường đặc thù của Employee/Admin
    if (userRole === 'staff' || userRole === 'technician' || userRole === 'admin') {
      fieldsToCompare.push('serviceCenter', 'shift');
    }

    fieldsToCompare.forEach(key => {
      // So sánh giá trị trong form với giá trị gốc của user
      if (String(formData[key]) !== String(user[key])) {
        payload[key] = formData[key];
        fieldsChanged++;
      }
    });

    if (fieldsChanged === 0) {
      setLoading(false);
      setEditMode(false);
      setMessage({ type: 'warning', text: 'Không có thông tin nào được thay đổi.' });
      return;
    }

    // 3. Xử lý logic đặc thù cho Employee/Admin (chuyển đổi kiểu dữ liệu)
    if (isEmployee) {
      // Đảm bảo các trường số được chuyển đổi đúng kiểu nếu API yêu cầu
      if (payload.serviceCenter !== undefined) payload.serviceCenter = parseInt(payload.serviceCenter, 10);
      if (payload.shift !== undefined) payload.shift = parseInt(payload.shift, 10);
      // API có thể yêu cầu gender phải là chuỗi 'Male', 'Female' thay vì 'male', 'female'
      if (payload.gender !== undefined) payload.gender = payload.gender.charAt(0).toUpperCase() + payload.gender.slice(1);
    }

    try {
      // 4. Thực hiện gọi API
      await API.patch(endpoint, payload);

      // 5. Xử lý thành công
      setLoading(false);
      setEditMode(false);
      setMessage({ type: 'success', text: `Cập nhật thành công!` });

      // Cập nhật state người dùng và localStorage
      const updatedUser = { ...user, ...payload };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (error) {
      // 6. Xử lý lỗi
      setLoading(false);
      const errorMessage = error.message || 'Lỗi không xác định khi cập nhật hồ sơ.';
      setMessage({
        type: 'error',
        text: `Cập nhật thất bại (${userRole.toUpperCase()} API): ${errorMessage}`,
      });
    }
  };

  const handleNavigateToVehicle = async () => {
    if (!userId || isEmployee) return; // Chỉ cho Customer

    setVehicleLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Vẫn gọi API để kiểm tra xem khách hàng có xe nào không
      const response = await API.get(`/vehicle/getByCustomerId/${userId}`);
      const vehicles = response.data?.data;

      if (vehicles && vehicles.length > 0) {
        navigate(`/VehicleListPage`);
      } else {
        setMessage({ type: 'warning', text: 'Bạn chưa có chiếc xe nào được đăng ký.' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối.';
      setMessage({ type: 'error', text: `Không tải được danh sách xe: ${errorMessage}` });
      console.error("Lỗi tải xe:", error);
    } finally {
      setVehicleLoading(false);
    }
  };

  // 4. Các hàm xử lý giao diện
  const startEdit = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      gender: user.gender || 'unknown',
      address: user.address || '',
      birth: user.birth || '',
      role: user.role || 'customer',
      serviceCenter: user.serviceCenter || '',
      shift: user.shift || '',
    });
    setMessage({ type: '', text: '' });
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  // Chỉ cần kiểm tra name và phone không được rỗng
  const isFormValid = formData.name?.trim() && formData.phone?.trim();

  // 5. Render chi tiết thông tin
  const renderDetail = (Icon, label, key, color, type = 'text', readOnly = false) => (
    <div className="flex items-center gap-3">
      <div className={`bg-${color}-100 p-3 rounded-xl text-${color}-600`}>
        <Icon size={20} />
      </div>
      <div className="w-full">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {(editMode && !readOnly) ? (
          key === 'gender' ? (
            <select
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base font-semibold text-gray-800 bg-white"
            >
              <option value="unknown">Không xác định</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>          
          ) : (
            <input
              type={type}
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base font-semibold text-gray-800"
              required={key === 'name' || key === 'phone'}
            />
          )
        ) : (
          <p className="text-base font-semibold text-gray-800">
            {key === 'gender' ? getGenderText(user[key]) : user[key] || "Không có"}
          </p>
        )}
      </div>
    </div>
  );

  // --- MODAL COMPONENT ---
  const CertificationModal = () => (
    <AnimatePresence>
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Award size={20} /> Chứng chỉ EV & Kỹ năng
              </h3>
              <button onClick={() => setShowCertModal(false)} className="hover:bg-white/20 p-1 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 overflow-y-auto">
               {certifications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có dữ liệu chứng chỉ.</p>
              ) : (
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.certificationID} className={`p-4 rounded-xl border-l-4 bg-gray-50 ${cert.active ? 'border-l-green-500' : 'border-l-red-500'}`}>
                       <div className="flex justify-between mb-1">
                          <span className="font-bold text-gray-800">{cert.certificateName}</span>
                          {cert.active 
                            ? <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Hiệu lực</span>
                            : <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">Hết hạn</span>
                          }
                       </div>
                       <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-2">
                          <p>Cấp bởi: <span className="font-semibold">{cert.issuedBy}</span></p>
                          <p>Level: <span className="font-semibold text-indigo-600">{cert.level}</span></p>
                          <p className="text-xs text-gray-500">Ngày cấp: {cert.issuedDate}</p>
                          <p className="text-xs text-gray-500">Hết hạn: {cert.expirationDate}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 text-right">
               <button onClick={() => setShowCertModal(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
                 Đóng
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-8 text-center text-white relative">
          <img
            src={user.avatar || "https://placehold.co/100x100/A0BFFF/FFFFFF?text=AV"}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg mx-auto mb-4 object-cover"
          />
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm opacity-90">{user.email}</p>
          <p className="text-xs opacity-70 uppercase mt-1">{userRole}</p>

          {!editMode && (
            <button onClick={startEdit} className="absolute top-4 right-4 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:bg-indigo-50">
              <Edit3 size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-8 bg-white">
          {message.text && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderDetail(User, 'Tên', 'name', 'blue')}
            {renderDetail(Mail, 'Email', 'email', 'indigo', 'email', true)}
            {renderDetail(Phone, 'Số điện thoại', 'phone', 'emerald', 'tel')}
            {renderDetail(UserCircle, 'Giới tính', 'gender', 'rose')}
            {renderDetail(MapPin, 'Địa chỉ', 'address', 'purple')}
            {renderDetail(Calendar, 'Ngày sinh', 'birth', 'orange', 'date')}

            {isEmployee && (
              <>
                <div className="col-span-1 sm:col-span-2 border-t border-gray-100 my-2"></div>
                <h3 className="col-span-1 sm:col-span-2 text-sm font-bold text-gray-400 uppercase tracking-wider">Thông tin công việc</h3>
                
                {renderDetail(Briefcase, 'Vai trò', 'role', 'cyan', 'text', true)}

                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-3 rounded-xl text-teal-600"><Building2 size={20} /></div>
                  <div className="w-full">
                    <p className="text-sm text-gray-500 font-medium">Trung tâm dịch vụ</p>
                    {editMode ? (
                      <select value={formData.serviceCenter} onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })} className="w-full border rounded p-1">
                         <option value="">-- Chọn --</option>
                         {serviceCenters.map(s => <option key={s.serviceCenterID} value={s.serviceCenterID}>{s.name}</option>)}
                      </select>
                    ) : <p className="font-semibold">{getServiceCenterName(user.serviceCenter)}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-xl text-pink-600"><Clock size={20} /></div>
                  <div className="w-full">
                    <p className="text-sm text-gray-500 font-medium">Ca làm việc</p>
                    {editMode ? (
                      <select value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })} className="w-full border rounded p-1">
                         <option value="">-- Chọn --</option>
                         {shifts.map(s => <option key={s.shiftID} value={s.shiftID}>{s.name}</option>)}
                      </select>
                    ) : <p className="font-semibold">{getShiftName(user.shift)}</p>}
                  </div>
                </div>

                {/* SỬA 3: Đưa nút bấm vào ĐÚNG VỊ TRÍ bên trong grid */}
                {userRole === 'technician' && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setShowCertModal(true)}
                  >
                    <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Award size={20} />
                    </div>
                    <div className="w-full flex justify-between items-center pr-2">
                      <div>
                        <p className="text-sm text-gray-500 font-medium group-hover:text-indigo-600">Chứng chỉ EV</p>
                        <p className="font-bold text-gray-800">
                          {certifications.length > 0 ? `${certifications.length} Chứng chỉ` : 'Chưa có'}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-indigo-600" />
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {userRole === 'customer' && !editMode && (
               <button onClick={handleNavigateToVehicle} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700">
                 <Car size={20} /> Xe của tôi
               </button>
            )}

            {editMode ? (
              <>
                <button onClick={handleUpdate} disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">
                  <Save size={20} /> Lưu
                </button>
                <button onClick={cancelEdit} disabled={loading} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300">
                  <X size={20} /> Hủy
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700">
                Trang chủ
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <CertificationModal />
    </div>
  );
};

export default Profile;
