import API from "./api"; // this is your axios instance from api.js

export const AdminAPI = {
  // get dashboard info
  getDashboard: () => API.get("/admin/dashboard"),

  // basic CRUD endpoints
  getById: (id) => API.get(`/admin/getby/${id}`),
  register: (data) => API.post("/admin/register", data),
  update: (id, data) => API.put(`/admin/update/${id}`, data),
  delete: (id) => API.delete(`/admin/delete/${id}`),
};
export default AdminAPI;