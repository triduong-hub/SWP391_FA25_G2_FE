import React, { useEffect, useState } from "react";
import API from "../../../../api";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    serviceID: null,
    serviceName: "",
    description: "",
    price: "",
    serviceType: "",
    estimatedTime: "",
    warrantyPeriod: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // SHOW TOAST
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2000);
  };

  // Load danh sách dịch vụ
  const loadServices = async () => {
    try {
      const res = await API.get("/services/getAll");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách!", "error");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({
      serviceID: null,
      serviceName: "",
      description: "",
      price: "",
      serviceType: "",
      estimatedTime: "",
      warrantyPeriod: "",
    });
    setIsEditing(false);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!form.serviceName.trim()) {
      showToast("Tên dịch vụ không được trống!", "warning");
      return;
    }

    try {
      if (isEditing) {
        await API.put(`/services/update/${form.serviceID}`, form);
        showToast("Cập nhật dịch vụ thành công!", "success");
      } else {
        await API.post("/services/create", form);
        showToast("Thêm dịch vụ thành công!", "success");
      }

      resetForm();
      loadServices();
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi lưu dịch vụ!", "error");
    }
  };

  // Khi bấm sửa
  const handleEdit = (sv) => {
    setForm({
      serviceID: sv.serviceID,
      serviceName: sv.serviceName,
      description: sv.description,
      price: sv.price,
      serviceType: sv.serviceType,
      estimatedTime: sv.estimatedTime,
      warrantyPeriod: sv.warrantyPeriod,
    });
    setIsEditing(true);
  };

  // Xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;

    try {
      await API.delete(`/services/delete/${id}`);
      showToast("Xóa dịch vụ thành công!", "success");
      loadServices();
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi xóa!", "error");
    }
  };

  return (
    <div className="p-4">
      {/* TOAST UI */}
      {toast.show && (
        <div
          className={`
            fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50
            ${toast.type === "success" ? "bg-green-600" : ""}
            ${toast.type === "error" ? "bg-red-600" : ""}
            ${toast.type === "warning" ? "bg-yellow-500" : ""}
          `}
        >
          {toast.message}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Quản lý Dịch vụ</h2>

      {/* FORM */}
      <div className="mb-6 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">
          {isEditing ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        </h3>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Tên dịch vụ"
          value={form.serviceName}
          onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Giá dịch vụ"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Loại dịch vụ (VD: Combo)"
          value={form.serviceType}
          onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Thời gian ước tính (VD: 02:00:00)"
          value={form.estimatedTime}
          onChange={(e) =>
            setForm({ ...form, estimatedTime: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Bảo hành (tháng)"
          value={form.warrantyPeriod}
          onChange={(e) =>
            setForm({ ...form, warrantyPeriod: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded mr-2"
        >
          {isEditing ? "Lưu thay đổi" : "Thêm mới"}
        </button>

        {isEditing && (
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Hủy
          </button>
        )}
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-300">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên dịch vụ</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Loại</th>
            <th className="p-2 border">Ước tính</th>
            <th className="p-2 border">Bảo hành</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((sv) => (
            <tr key={sv.serviceID} className="border">
              <td className="p-2 border">{sv.serviceID}</td>
              <td className="p-2 border">{sv.serviceName}</td>
              <td className="p-2 border">{sv.price}</td>
              <td className="p-2 border">{sv.serviceType}</td>
              <td className="p-2 border">{sv.estimatedTime}</td>
              <td className="p-2 border">{sv.warrantyPeriod}</td>
              <td className="p-2 border">{sv.description}</td>

              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(sv)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(sv.serviceID)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;
