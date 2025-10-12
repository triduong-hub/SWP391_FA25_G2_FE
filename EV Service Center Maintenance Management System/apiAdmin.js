// src/api/adminApi.js
import API from "./api";

export const AdminAPI = {
  // 1. Get Admin by ID
  getById: (id) => API.get(`/admin/getby/${id}`),

  // 2. Register new Admin
  create: (data) => API.post(`/admin/register`, data),

  // 3. Update Admin
  update: (id, data) => API.put(`/admin/update/${id}`, data),

  // 4. Delete Admin
  delete: (id) => API.delete(`/admin/delete/${id}`),

  // 5. Get Dashboard data
  getDashboard: () => API.get(`/admin/dashboard`),

  // 6. (Optional) Get all admins - for management purposes
  getAll: () => API.get(`/admin/getAll`),
};
export default AdminAPI;