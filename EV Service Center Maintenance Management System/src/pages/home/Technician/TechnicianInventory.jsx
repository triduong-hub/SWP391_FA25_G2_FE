import React, { useState, useEffect } from "react";
import { Search, Package, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import api from "../../../../api"; 

const TechnicianInventory = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const serviceCenterId = storedUser.serviceCenterId || storedUser.serviceCenterID || 1; 

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/components/search/by-service-center/${serviceCenterId}`);
        
        console.log("📦 Kho linh kiện:", res.data);
        setComponents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Lỗi khi tải kho linh kiện:", err);
        if (err.response && err.response.status === 404) {
             setComponents([]); 
        }
      } finally {
        setLoading(false);
      }
    };

    if (serviceCenterId) {
        fetchComponents();
    }
  }, [serviceCenterId]);

  const filteredComponents = components.filter((item) => {
    const matchSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = filterType === "all" || item.type === filterType;

    return matchSearch && matchType;
  });

  // Lấy danh sách các loại linh kiện (unique) để làm dropdown filter
  const componentTypes = ["all", ...new Set(components.map((c) => c.type).filter(Boolean))];

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" /> Kho Linh Kiện
          </h1>
          <p className="text-gray-500 text-sm">
            Chi nhánh: <span className="font-medium text-gray-700">{storedUser.serviceCenterName || "Chi nhánh hiện tại"}</span>
          </p>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:min-w-[300px]">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                type="text"
                placeholder="Tìm tên hoặc mã linh kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            
            <div className="relative">
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white"
                >
                    {componentTypes.map(type => (
                        <option key={type} value={type}>
                            {type === 'all' ? 'Tất cả loại' : type}
                        </option>
                    ))}
                </select>
                <Filter className="absolute right-2 top-3 text-gray-400 w-4 h-4 pointer-events-none"/>
            </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : filteredComponents.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
            <p>Không tìm thấy linh kiện nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComponents.map((item) => {
            const isLowStock = item.quantity <= (item.minQuantity || 5);

            return (
              <div
                key={item.componentID}
                className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md flex flex-col ${
                  isLowStock ? "border-orange-200" : "border-gray-200"
                }`}
              >
                {/* IMAGE */}
                <div className="h-48 w-full bg-gray-100 rounded-t-xl overflow-hidden relative">
                  <img
                    src={item.imageUrl || "https://placehold.co/300x200?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://via.placeholder.com/300?text=No+Image"
                    }}
                  />
                  {isLowStock && (
                    <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                      <AlertTriangle className="w-3 h-3" /> Sắp hết
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {item.code}
                        </span>
                        <h3 className="font-bold text-gray-800 mt-1 line-clamp-2" title={item.name}>
                            {item.name}
                        </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                    {item.description || "Chưa có mô tả"}
                  </p>

                  <div className="border-t border-gray-100 pt-3 mt-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Số lượng:</span>
                        <span className={`font-semibold ${isLowStock ? "text-orange-600" : "text-gray-900"}`}>
                            {item.quantity}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Đơn giá:</span>
                        <span className="font-bold text-blue-600 text-lg">
                            {item.price?.toLocaleString()} đ
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TechnicianInventory;