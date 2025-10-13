import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import axios from "axios";

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    owner: "",
    licensePlate: "",
    model: "",
    status: "",
  });

  // ✅ Load vehicles
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/vehicle/getAll");
        setCars(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách xe:", err);
      }
    };
    fetchCars();
  }, []);

  // ✅ Save (Create / Update)
  const handleSave = async () => {
    if (!formData.owner || !formData.licensePlate || !formData.model) {
      alert("Vui lòng nhập đủ thông tin xe");
      return;
    }

    try {
      if (editingCar) {
        await axios.put(
          `http://localhost:8080/api/vehicle/update/${editingCar.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:8080/api/vehicle/create", formData);
      }

      const res = await axios.get("http://localhost:8080/api/vehicle/getAll");
      setCars(res.data);

      setShowForm(false);
      setEditingCar(null);
      setFormData({ owner: "", licensePlate: "", model: "", status: "" });
    } catch (err) {
      console.error("❌ Lỗi khi lưu xe:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa xe này không?")) {
      try {
        await axios.delete(`http://localhost:8080/api/vehicle/delete/${id}`);
        setCars(cars.filter((c) => c.id !== id));
      } catch (err) {
        console.error("❌ Lỗi khi xóa xe:", err);
      }
    }
  };

  // ✅ Filter search
  const filteredCars = cars.filter((c) =>
    [c.owner, c.licensePlate, c.model, c.status].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Xe điện</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Thêm xe
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border border-gray-300 rounded-xl px-2 bg-white/90 backdrop-blur w-80 mb-4 shadow-sm">
        <Search className="w-4 h-4 text-emerald-600" />
        <input
          type="text"
          placeholder="Tìm kiếm chủ xe, biển số, mẫu xe..."
          className="px-2 py-2 outline-none w-full bg-transparent text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white/90 backdrop-blur rounded-2xl shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 uppercase text-sm">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Chủ sở hữu</th>
              <th className="px-4 py-3">Biển số</th>
              <th className="px-4 py-3">Mẫu xe</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredCars.map((car) => (
                <tr
                  key={car.id}
                  className="border-b border-gray-300 last:border-b-0 hover:bg-emerald-50 transition"
                >
                  <td className="px-4 py-2">{car.id}</td>
                  <td className="px-4 py-2">{car.owner}</td>
                  <td className="px-4 py-2">{car.licensePlate}</td>
                  <td className="px-4 py-2">{car.model}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      car.status === "Hoạt động"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {car.status || "Không rõ"}
                  </td>
                  <td className="px-4 py-2 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setEditingCar(car);
                        setFormData({
                          owner: car.owner,
                          licensePlate: car.licensePlate,
                          model: car.model,
                          status: car.status,
                        });
                        setShowForm(true);
                      }}
                      className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingCar ? "Sửa thông tin xe" : "Thêm xe mới"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Chủ sở hữu"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Biển số xe"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Mẫu xe"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Trạng thái (VD: Hoạt động, Đang bảo dưỡng)"
                className="w-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 px-3 py-2 rounded-lg"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCar(null);
                  setFormData({
                    owner: "",
                    licensePlate: "",
                    model: "",
                    status: "",
                  });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManagement;
