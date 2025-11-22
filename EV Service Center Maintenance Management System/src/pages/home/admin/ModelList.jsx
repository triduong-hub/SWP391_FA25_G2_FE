import React, { useEffect, useState } from "react";
import API from "../../../../api";

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({
    modelID: null,
    modelName: "",
    imageFile: null, // file mới upload
    imagePreview: "", // preview ảnh
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load danh sách model
  const loadModels = async () => {
    try {
      const res = await API.get("/model");
      setModels(res.data);
    } catch (err) {
      console.error(err);
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

  // Submit form
  const handleSubmit = async () => {
    if (!form.modelName.trim()) {
      alert("Vui lòng nhập tên model.");
      return;
    }

    const formData = new FormData();
    formData.append("modelName", form.modelName);
    if (form.imageFile) {
      formData.append("image", form.imageFile); // file upload
    }

    try {
      if (isEditing) {
        await API.put(`/model/update/${form.modelID}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật thành công!");
      } else {
        await API.post("/model/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm model thành công!");
      }
      resetForm();
      loadModels();
    } catch (err) {
      console.error("PUT/POST lỗi:", err);
      alert("Lưu model thất bại!");
    }
  };

  // Edit model
  const handleEdit = (m) => {
    setForm({
      modelID: m.modelID,
      modelName: m.modelName,
      imageFile: null,         // chưa đổi file
      imagePreview: m.imageUrl, // preview ảnh
    });
    setIsEditing(true);
  };

  // Delete model
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa model này?")) return;

    try {
      await API.delete(`/model/delete/${id}`);
      alert("Xóa thành công!");
      loadModels();
    } catch (err) {
      console.error(err);
    }
  };

  // Khi chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageFile: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Quản lý Model xe 
      </h2>

      {/* FORM */}
      <div className="mb-6 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">
          {isEditing ? "Chỉnh sửa Model" : "Thêm Model mới"}
        </h3>

        {/* Tên model */}
        <input
          className="border p-2 w-full mb-2"
          placeholder="Tên Model"
          value={form.modelName}
          onChange={(e) => setForm({ ...form, modelName: e.target.value })}
        />

        {/* File input ảnh */}
        <input
          type="file"
          className="border p-2 w-full mb-2"
          onChange={handleFileChange}
        />

        {/* Preview ảnh */}
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
                <img
                  src={m.imageUrl}
                  alt=""
                  className="w-20 h-auto rounded"
                />
              </td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(m.modelID)}
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
