import React, { useState, useEffect } from "react";
import api from "../../../api";
import { Edit, Trash2 } from "lucide-react"; 


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
      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow">
        <table className="w-full border-collapse bg-white/90 backdrop-blur text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-100 to-blue-100 text-gray-700 uppercase text-center">
              <th className="p-3 w-[6%]">ID</th>
              <th className="p-3 w-[22%] text-left">Chủ sở hữu</th>
              <th className="p-3 w-[15%]">Biển số</th>
              <th className="p-3 w-[20%]">Mẫu xe</th>
              <th className="p-3 w-[20%]">VIN</th>
              <th className="p-3 w-[17%]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr
                key={car.vehicleID || index}
                className="border-b hover:bg-emerald-50/60 transition text-gray-900 text-center align-middle"
              >
                <td className="p-3 font-medium align-middle">{car.vehicleID}</td>
                <td className="p-3 text-left align-middle whitespace-nowrap">
                  {car.customerName}
                </td>
                <td className="p-3 align-middle">{car.licensePlate}</td>
                <td className="p-3 align-middle">
                  {car.model?.modelName || "Không rõ"}
                </td>
                <td className="p-3 align-middle">{car.vin || "Không rõ"}</td>
                <td className="px-4 py-2 flex justify-center space-x-3">
                  <button
                    onClick={() => handleEdit(car.vehicleID)}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg shadow transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(car.vehicleID)}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg shadow transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {cars.length === 0 && (
          <p className="p-4 text-gray-500 text-center">Không có dữ liệu xe.</p>
        )}
      </div>

    </div>
  );
};

export default CarManagement;
