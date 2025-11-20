import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, UserCircle, Edit3, Save, X, Briefcase, MapPin, Calendar, Car, Clock, Building2 } from "lucide-react";
import API from '../../../../api';


const ALL_EMPLOYEE_ROLES = ['staff', 'technician', 'admin'];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [shifts, setShifts] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [vehicleLoading, setVehicleLoading] = useState(false);

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
    if (isEmployee) {
      const fetchData = async () => {
        try {
          // Gọi song song 2 API để tối ưu tốc độ
          const [shiftRes, centerRes] = await Promise.all([
            API.get('/shifts/getAll'),
            API.get('/service-centers/getAll') // Gọi endpoint từ ServiceCenterController
          ]);

          setShifts(shiftRes.data || []);
          setServiceCenters(centerRes.data || []);
        } catch (error) {
          console.error("Lỗi tải dữ liệu hệ thống:", error);
        }
      };
      fetchData();
    }
  }, [isEmployee]);

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
      fieldsToCompare.push('role', 'serviceCenter', 'shift');
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
          ) : key === 'role' ? (
            <select
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base font-semibold text-gray-800 bg-white"
              disabled={userRole === 'admin'} // Admin role thường không được thay đổi
            >
              {['customer', 'staff', 'tech', 'admin'].map(r => (
                <option key={r} value={r}>{r.toUpperCase()}</option>
              ))}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-8 text-center text-white relative">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={user.avatar || "https://placehold.co/100x100/A0BFFF/FFFFFF?text=AV"}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg mx-auto mb-4 object-cover"
          />
          <h1 className="text-2xl font-bold tracking-tight">
            {user.name?.trim() || "Người dùng"}
          </h1>
          <p className="text-sm opacity-90 mt-1">{user.email}</p>
          <p className="text-xs opacity-70 mt-1">{userRole.toUpperCase()}</p>

          {/* Edit Button */}
          {!editMode && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={startEdit}
              className="absolute top-4 right-4 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:bg-indigo-50 transition"
              aria-label="Chỉnh sửa hồ sơ"
            >
              <Edit3 size={20} />
            </motion.button>
          )}
        </div>

        {/* Body */}
        <div className="p-8 bg-white">
          {/* Message Box */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 mb-6 rounded-xl text-sm font-medium ${message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : message.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
                }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderDetail(User, 'Tên', 'name', 'blue')}
            {renderDetail(Mail, 'Email', 'email', 'indigo', 'email', true)} {/* Email Read Only */}
            {renderDetail(Phone, 'Số điện thoại', 'phone', 'emerald', 'tel')}
            {renderDetail(UserCircle, 'Giới tính', 'gender', 'rose')}
            {renderDetail(MapPin, 'Địa chỉ', 'address', 'purple')}
            {renderDetail(Calendar, 'Ngày sinh', 'birth', 'orange', 'date')}

            {/* Các trường đặc thù của Employee/Admin */}
            {isEmployee && (
              <>
                <div className="col-span-1 sm:col-span-2 border-t border-gray-100 my-2"></div>
                <h3 className="col-span-1 sm:col-span-2 text-sm font-bold text-gray-400 uppercase tracking-wider">Thông tin công việc</h3>

                {renderDetail(Briefcase, 'Vai trò', 'role', 'cyan', 'text', true)}

                {/* --- KHỐI HIỂN THỊ TRUNG TÂM DỊCH VỤ --- */}
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-3 rounded-xl text-teal-600">
                    <Building2 size={20} />
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-gray-500 font-medium">Trung tâm dịch vụ</p>
                    {editMode ? (
                      <select
                        value={formData.serviceCenter}
                        onChange={(e) => setFormData({ ...formData, serviceCenter: parseInt(e.target.value) })}
                        className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 bg-white"
                      >
                        <option value="">-- Chọn trung tâm --</option>
                        {serviceCenters.map(sc => (
                          // Lưu ý: Dùng serviceCenterID hoặc id tùy vào response API của bạn
                          <option key={sc.serviceCenterID || sc.id} value={sc.serviceCenterID || sc.id}>
                            {sc.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-base font-semibold text-gray-800">
                        {getServiceCenterName(user.serviceCenter)}
                      </p>
                    )}
                  </div>
                </div>

                {/* --- KHỐI HIỂN THỊ CA LÀM VIỆC --- */}
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-xl text-pink-600">
                    <Clock size={20} />
                  </div>
                  <div className="w-full">
                    <p className="text-sm text-gray-500 font-medium">Ca làm việc</p>
                    {editMode ? (
                      <select
                        value={formData.shift}
                        onChange={(e) => setFormData({ ...formData, shift: parseInt(e.target.value) })}
                        className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-blue-500 bg-white"
                      >
                        <option value="">-- Chọn ca --</option>
                        {shifts.map(s => (
                          <option key={s.shiftID} value={s.shiftID}>
                            {s.name} ({s.start_time || s.startTime?.substring(0, 5)} - {s.end_time || s.endTime?.substring(0, 5)})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-base font-semibold text-gray-800">
                        {getShiftName(user.shift)}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">

            {/* NÚT CHUYỂN HƯỚNG SANG XE (CHỈ HIỂN THỊ CHO CUSTOMER) */}
            {userRole === 'customer' && !editMode && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNavigateToVehicle}
                disabled={vehicleLoading}
                className="flex items-center space-x-2 bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl shadow hover:bg-indigo-700 transition"
              >
                {vehicleLoading ? 'Đang tìm xe...' : (
                  <>
                    <Car size={20} />
                    <span>Xem & Chỉnh sửa Xe</span>
                  </>
                )}
              </motion.button>
            )}

            {editMode ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpdate}
                  disabled={loading || !isFormValid}
                  className={`flex items-center space-x-2 font-medium px-6 py-2.5 rounded-xl shadow transition ${isFormValid && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {loading ? 'Đang cập nhật...' : (
                    <>
                      <Save size={20} />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={cancelEdit}
                  className="flex items-center space-x-2 bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-xl shadow hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  <X size={20} />
                  <span>Hủy</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
              >
                Quay lại trang chủ
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
