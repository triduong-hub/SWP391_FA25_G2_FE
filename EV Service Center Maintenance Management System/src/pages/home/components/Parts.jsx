import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Eye, CreditCard as Edit3, Trash2, CheckCircle, XCircle, AlertTriangle, Activity, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import api from '../../../../api'; // đường dẫn thật tới file api.js
import AIMinStock from './AIMinStock';
import { useNavigate } from "react-router-dom";

const Parts = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const categories = ['Truyền động', 'Làm mát', 'Điện & Nguồn'];
  const suppliers = ['Tesla Vietnam', 'VinFast Parts', 'BMW Parts Center', 'EV Solutions Ltd', 'Audi Parts Vietnam', 'Michelin Vietnam'];


  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await api.get('/components/getAll'); // gọi API thật
        console.log('Dữ liệu API:', response.data);
        setParts(response.data);
      } catch (err) {
        console.error('Lỗi khi tải phụ tùng:', err);
        setError('Không thể tải dữ liệu từ server');
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

// 🟢 Add or Update Part
const handleSavePart = async (e) => {
  e.preventDefault();
  const form = e.target;

  try {
    if (selectedPart) {
      // 🟢 UPDATE — send only necessary fields
      const updatedPart = {
        price: parseFloat(form.price.value || 0),
        quantity: parseInt(form.quantity.value || 0),
        minQuantity: parseInt(form.minQuantity.value || 0),
        supplierName: form.supplierName.value,
        description: form.description.value,
        serviceCenterID: 1, // required by backend
        status: "active", // ensure still active after update
      };

      await api.put(`/components/update/${selectedPart.componentID}`, updatedPart);
      alert("✅ Cập nhật phụ tùng thành công!");
    } else {
      // 🟢 CREATE — still use multipart/form-data
      const formData = new FormData();
      formData.append("name", form.name.value);
      formData.append("code", form.code.value);
      formData.append("type", form.type.value);
      formData.append("description", form.description.value);
      formData.append("price", form.price.value);
      formData.append("quantity", form.quantity.value);
      formData.append("minQuantity", form.minQuantity.value || 0);
      formData.append("supplierName", form.supplierName.value);
      formData.append("serviceCenterID", 1);
      formData.append("status", "active"); // always active on creation
      // formData.append("image", form.image?.files?.[0]); // optional

      await api.post("/components/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Thêm phụ tùng mới thành công!");
    }

    setShowAddModal(false);
    const response = await api.get("/components/getAll");
    setParts(response.data);
  } catch (err) {
    console.error("❌ Lỗi khi lưu phụ tùng:", err);
    alert("Không thể lưu phụ tùng. Kiểm tra console để biết thêm chi tiết.");
  }
};

// 🔴 Delete Part
const handleDeletePart = async (id) => {
  if (!window.confirm('Bạn có chắc chắn muốn xóa phụ tùng này?')) return;

  try {
    await api.delete(`/components/delete/${id}`);
    setParts(parts.filter(p => p.componentID !== id));
    alert('✅ Xóa phụ tùng thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi xóa phụ tùng:', err);
    alert('Không thể xóa phụ tùng.');
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "in_stock": return "bg-green-100 text-green-800";
      case "low_stock": return "bg-yellow-100 text-yellow-800";
      case "out_of_stock": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "in_stock": return "Còn hàng";
      case "low_stock": return "Sắp hết";
      case "out_of_stock": return "Hết hàng";
      default: return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "in_stock": return CheckCircle;
      case "low_stock": return AlertTriangle;
      case "out_of_stock": return XCircle;
      default: return Activity;
    }
  };

  const getStockStatus = (part) => {
    if (part.quantity === 0) return "out_of_stock";
    if (part.quantity <= part.minQuantity) return "low_stock";
    return "in_stock";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredParts = parts.filter(part => {
    const name = part.name?.toLowerCase() || "";
    const code = part.code?.toLowerCase() || "";
    const supplier = part.supplierName?.toLowerCase() || "";

    const matchesCategory = filterCategory === 'all' || part.type === filterCategory;
    const matchesStatus = filterStatus === 'all' || getStockStatus(part) === filterStatus;
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm.toLowerCase()) ||
      supplier.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });


  const handleViewDetails = (part) => {
    setSelectedPart(part);
    setShowDetailModal(true);
  };

  const handleAddPart = () => {
    setSelectedPart(null);
    setShowAddModal(true);
  };

  const handleEditPart = (part) => {
    setSelectedPart(part);
    setShowAddModal(true);
  };

  // Statistics
  const totalParts = parts.length;
  const inStockParts = parts.filter(p => getStockStatus(p) === 'in_stock').length;
  const lowStockParts = parts.filter(p => getStockStatus(p) === 'low_stock').length;
  const outOfStockParts = parts.filter(p => getStockStatus(p) === 'out_of_stock').length;
  const totalValue = parts.reduce((sum, part) => sum + (part.price * part.quantity), 0);


  if (loading) return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/*   Floating AI Assistant (Chat replacement) */}
      <AIMinStock selectedPart={selectedPart} />
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parts Management</h1>
          <p className="text-gray-600 mt-1">Quản lý kho phụ tùng và linh kiện</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center text-gray-500">
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-sm">Cập nhật: {new Date().toLocaleTimeString('vi-VN')}</span>
          </div>

          {/* 🔹 Nút thêm phụ tùng */}
          <button
            onClick={handleAddPart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phụ tùng</span>
          </button>

          {/* 🔹 Nút quay về nằm kế bên */}
          <button
            onClick={() => {
              const role = localStorage.getItem("role");
              if (role === "technician") navigate("/techniciandash");
              else navigate("/staffdash");
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2"
          >
             <span>Quay về</span>
          </button>
        </div>
      </div>


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-xl mr-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{totalParts}</h3>
              <p className="text-gray-600 text-sm">Tổng phụ tùng</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{inStockParts}</h3>
              <p className="text-gray-600 text-sm">Còn hàng</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-xl mr-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{lowStockParts}</h3>
              <p className="text-gray-600 text-sm">Sắp hết</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-xl mr-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{outOfStockParts}</h3>
              <p className="text-gray-600 text-sm">Hết hàng</p>
            </div>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phụ tùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả tình trạng kho</option>
            <option value="in_stock">Còn hàng</option>
            <option value="low_stock">Sắp hết</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>



          <div className="flex items-center text-gray-500">
            <Filter className="w-4 h-4 mr-2" />
            <span className="text-sm">Tìm thấy {filteredParts.length} phụ tùng</span>
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Danh sách phụ tùng</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã & Tên</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng tối thiểu</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà cung cấp</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParts.map((part, index) => {
                const stockStatus = getStockStatus(part);
                const StatusIcon = getStatusIcon(stockStatus);
                return (
                  <tr key={`part-${part.componentID || index}`} className="hover:bg-gray-50">
                    {/* Mã & Tên */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.code}</div>
                        <div className="text-sm text-gray-500">{part.name}</div>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {part.type}
                      </span>
                    </td>

                    {/* Giá */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(part.price)}</div>
                    </td>

                    {/* Số lượng */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.quantity}</div>
                    </td>

                    {/*   Số lượng tối thiểu */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${part.quantity <= part.minQuantity ? 'text-yellow-600' : 'text-gray-900'
                          }`}
                      >
                        {part.minQuantity}
                      </div>
                    </td>

                    {/* Nhà cung cấp */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{part.supplierName}</div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          part.status
                        )}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusText(stockStatus)}
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(part)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPart(part)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePart(part.componentID)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Part Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedPart ? 'Chỉnh sửa phụ tùng' : 'Thêm phụ tùng mới'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={handleSavePart}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã phụ tùng</label>
                    <input
                      name="code"                                     
                      type="text"
                      defaultValue={selectedPart?.code || ''}
                      readOnly={!!selectedPart} 
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none ${
                        selectedPart ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                      }`}
                      placeholder="P001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <select
                      name="type"                                      
                      defaultValue={selectedPart?.type || ''}
                      disabled={!!selectedPart}
                      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none ${
                        selectedPart ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                      }`}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên phụ tùng</label>
                  <input
                    name="name"                                       
                    type="text"
                    defaultValue={selectedPart?.name || ''}
                    readOnly={!!selectedPart}
                    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none ${
                        selectedPart ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                      }`}
                    placeholder="Nhập tên phụ tùng"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                    <input
                      name="price"                                    
                      type="number"
                      defaultValue={selectedPart?.price || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                    <input
                      name="quantity"                                
                      type="number"
                      defaultValue={selectedPart?.quantity || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tối thiểu</label>
                    <input
                      name="minQuantity"                              
                      type="number"
                      defaultValue={selectedPart?.minQuantity || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nhà cung cấp</label>
                    <input
                      name="supplierName"
                      type="text"
                      defaultValue={selectedPart?.supplierName || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tên nhà cung cấp"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    name="description"                                
                    rows={3}
                    defaultValue={selectedPart?.description || ''}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả chi tiết về phụ tùng"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"                                   
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"                                   
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {selectedPart ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Part Detail Modal */}
      {showDetailModal && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết phụ tùng</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Thông tin cơ bản</h4>
                  <p className="mb-2"><strong>Mã:</strong> {selectedPart.code}</p>
                  <p className="mb-2"><strong>Tên:</strong> {selectedPart.name}</p>
                  <p className="mb-2"><strong>Danh mục:</strong> {selectedPart.type}</p>
                  <p className="mb-0"><strong>Giá:</strong> {formatPrice(selectedPart.price)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Kho & Trạng thái</h4>
                  <p className="mb-2"><strong>Số lượng:</strong> {selectedPart.quantity}</p>
                  <p className="mb-2"><strong>Số lượng tối thiểu:</strong> {selectedPart.minQuantity}</p>
                  <p className="mb-2"><strong>Nhà cung cấp:</strong> {selectedPart.supplierName}</p>
                  <p className="mb-0"><strong>Trạng thái:</strong>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPart.status)}`}>
                      {getStatusText(selectedPart.status)}
                    </span>
                  </p>
                </div>
              </div>

              {selectedPart.description && (
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-bold text-gray-900 mb-3">Mô tả</h4>
                  <p className="mb-0">{selectedPart.description}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h4 className="font-bold text-gray-900 mb-3">Thống kê</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">
                      <strong>Tổng giá trị:</strong> {formatPrice(selectedPart.price * selectedPart.quantity)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2"><strong>Cập nhật:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parts;