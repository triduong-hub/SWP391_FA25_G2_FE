import React, { useEffect, useState } from "react";
import API from "../../../../api";

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Popup xác nhận xóa
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  const [form, setForm] = useState({
    modelID: null,
    modelName: "",
    imageFile: null,
    imagePreview: "",
  });

  // SHOW TOAST (tự ẩn sau 2 giây)
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      2000
    );
  };

  // Load danh sách model
  const loadModels = async () => {
    try {
      const res = await API.get("/model");
      setModels(res.data);
    } catch (err) {
      console.error(err);
      showToast("Không thể tải danh sách!", "error");
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({ modelID: null, modelName: "", imageFile: null, imagePreview: "" });
    setIsEditing(false);
  };

  // Submit
  const handleSubmit = async () => {
    if (!form.modelName.trim()) {
      showToast("Vui lòng nhập tên model!", "warning");
      return;
    }

    try {
      const formData = new FormData();

      // Tạo object modelDTO
      const modelDTO = { modelName: form.modelName };
      formData.append("modelDTO", JSON.stringify(modelDTO));

      // Nếu có file mới thì append
      if (form.imageFile) formData.append("image", form.imageFile);

      if (isEditing) {
        await API.put(`/model/update/${form.modelID}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Cập nhật thành công!", "success");
      } else {
        await API.post("/model/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast("Thêm model thành công!", "success");
      }

      resetForm();
      loadModels();
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi lưu model!", "error");
    }
  };

  // Edit
  const handleEdit = (m) => {
    setForm({
      modelID: m.modelID,
      modelName: m.modelName,
      imageFile: null,
      imagePreview: m.imageUrl,
    });
    setIsEditing(true);
  };

  // Xóa
  const openDeleteConfirm = (id) => {
    setConfirmDelete({ show: true, id });
  };

  const confirmDeleteAction = async () => {
    try {
      await API.delete(`/model/delete/${confirmDelete.id}`);
      showToast("Xóa thành công!", "success");
      loadModels();
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi xóa!", "error");
    }
    setConfirmDelete({ show: false, id: null });
  };

  // Chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="p-4">

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white z-50 transition-all
            ${toast.type === "success" ? "bg-green-600" : ""}
            ${toast.type === "error" ? "bg-red-600" : ""}
            ${toast.type === "warning" ? "bg-yellow-500" : ""}
          `}
        >
          {toast.message}
        </div>
      )}

      {/* POPUP CONFIRM DELETE */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Bạn có chắc muốn xóa?</h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Xóa
              </button>
              <button
                onClick={() => setConfirmDelete({ show: false, id: null })}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Quản lý Model xe</h2>

      {/* FORM */}
      <div className="mb-6 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">
          {isEditing ? "Chỉnh sửa Model" : "Thêm Model mới"}
        </h3>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Tên Model"
          value={form.modelName}
          onChange={(e) => setForm({ ...form, modelName: e.target.value })}
        />

        {/* File input luôn hiển thị */}
        <input
          type="file"
          className="border p-2 w-full mb-2"
          onChange={handleFileChange}
        />

        {form.imagePreview && (
          <img
            src={form.imagePreview}
            alt="Preview"
            className="w-32 h-auto mb-2 rounded"
          />
        )}

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
            <th className="p-2 border">Tên Model</th>
            <th className="p-2 border">Hình ảnh</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.modelID} className="border">
              <td className="p-2 border">{m.modelID}</td>
              <td className="p-2 border">{m.modelName}</td>
              <td className="p-2 border">
                <img src={m.imageUrl} alt="" className="w-20 h-auto rounded" />
              </td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => openDeleteConfirm(m.modelID)}
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

export default ModelList;
