import axios from "axios";

const API_URL = "http://localhost:8080/api/bookings";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const bookingService = {
  // Lấy tất cả đơn hàng
  getAllBookings: async () => {
    const response = await axios.get(`${API_URL}/all`, getAuthHeader());
    return response.data; 
  },

  // Lấy đơn hàng theo trạng thái
  getBookingsByStatus: async (status) => {
    const response = await axios.get(`${API_URL}/status/${status}`, getAuthHeader());
    return response.data;
  },

  // Tạo đơn hàng mới
  createBooking: async (bookingData) => {
    const response = await axios.post(API_URL, bookingData, getAuthHeader());
    return response.data;
  },

  // Admin/Staff hủy đơn (bao gồm trường hợp No-Show)
  cancelBookingByAdmin: async (orderId) => {
    // Lấy thông tin user hiện tại để gửi kèm request
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "ADMIN";
    // Lấy ID tương ứng với role (Backend yêu cầu userId)
    const userId = role === "ADMIN" 
      ? localStorage.getItem("adminId") 
      : localStorage.getItem("employeeId");

    const response = await axios.put(
      `${API_URL}/${orderId}/admin-cancel`,
      null, // Body null
      {
        ...getAuthHeader(),
        params: {
          userId: userId,
          role: role
        }
      }
    );
    return response.data;
  }
};