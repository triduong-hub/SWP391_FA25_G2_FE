import React, { useState, useEffect } from "react";
import api from "../../../api";


const CarManagement = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/vehicle/getAll");
        console.log("Dữ liệu xe từ API:", response.data);
        setCars(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách xe:", error);
      }
    };

    fetchCars();
  }, []);

  const handleAdd = () => {
    alert("➕ Thêm xe mới");
  };

  const handleEdit = (id) => {
    alert("✏️ Sửa thông tin xe ID: " + id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa xe ID: " + id + " ?")) {
      setCars(cars.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">🚗 Danh sách xe điện</h3>
        {/* <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
        >
          Thêm xe
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow">
        <table className="w-full border-collapse bg-white/90 backdrop-blur">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 text-sm uppercase">
              <th className="p-3">ID</th>
              <th className="p-3">Chủ sở hữu</th>
              <th className="p-3">Biển số</th>
              <th className="p-3">Mẫu xe</th>
              <th className="p-3">Vin</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr
                key={car.vehicleID || index}
                className="border-b hover:bg-emerald-50/50 transition text-gray-900"
              >
                <td className="p-3">{car.vehicleID}</td>
                <td className="p-3">{car.customerName}</td>
                <td className="p-3">{car.licensePlate}</td>
                <td className="p-3">{car.model?.modelName || "Không rõ"}</td>
                <td className="p-3">{car.vin || "Không rõ"}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(car.vehicleID)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(car.vehicleID)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white px-3 py-1 rounded-lg shadow"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
        {cars.length === 0 && (
          <p className="p-4 text-gray-500 text-center">
            Không có dữ liệu xe.
          </p>
        )}
      </div>
    </div>
  );
};

export default CarManagement;
