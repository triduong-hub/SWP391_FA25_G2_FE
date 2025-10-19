import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Eye, CreditCard as Edit3, Trash2, CheckCircle, XCircle, AlertTriangle, Activity, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';

const Parts = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample parts data
  const parts = [
    {
      partID: 'P001',
      partName: 'Tesla Model 3 Battery Pack',
      category: 'Battery',
      price: 25000000,
      quantity: 5,
      supplier: 'Tesla Vietnam',
      status: 'in_stock',
      description: 'Original Tesla Model 3 battery pack with 75kWh capacity'
    },
    {
      partID: 'P002',
      partName: 'VinFast VF8 Motor Assembly',
      category: 'Motor',
      price: 15000000,
      quantity: 3,
      supplier: 'VinFast Parts',
      status: 'low_stock',
      description: 'Electric motor assembly for VinFast VF8 front wheel drive'
    },
    {
      partID: 'P003',
      partName: 'BMW iX Brake Pads Set',
      category: 'Brake',
      price: 2500000,
      quantity: 15,
      supplier: 'BMW Parts Center',
      status: 'in_stock',
      description: 'High-performance brake pads for BMW iX electric vehicle'
    },
    {
      partID: 'P004',
      partName: 'Universal EV Charging Cable',
      category: 'Charging',
      price: 3500000,
      quantity: 0,
      supplier: 'EV Solutions Ltd',
      status: 'out_of_stock',
      description: 'Type 2 to Type 2 charging cable, 32A, 7.4kW'
    },
    {
      partID: 'P005',
      partName: 'Audi e-tron Suspension Kit',
      category: 'Suspension',
      price: 8500000,
      quantity: 2,
      supplier: 'Audi Parts Vietnam',
      status: 'low_stock',
      description: 'Complete air suspension kit for Audi e-tron models'
    },
    {
      partID: 'P006',
      partName: 'EV Tire Set (18 inch)',
      category: 'Tire',
      price: 12000000,
      quantity: 8,
      supplier: 'Michelin Vietnam',
      status: 'in_stock',
      description: 'Low rolling resistance tires optimized for electric vehicles'
    }
  ];

  const categories = ['Battery', 'Motor', 'Brake', 'Charging', 'Suspension', 'Tire', 'Electronics'];
  const suppliers = ['Tesla Vietnam', 'VinFast Parts', 'BMW Parts Center', 'EV Solutions Ltd', 'Audi Parts Vietnam', 'Michelin Vietnam'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock': return 'Còn hàng';
      case 'low_stock': return 'Sắp hết';
      case 'out_of_stock': return 'Hết hàng';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock': return CheckCircle;
      case 'low_stock': return AlertTriangle;
      case 'out_of_stock': return XCircle;
      default: return Activity;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredParts = parts.filter(part => {
    const matchesCategory = filterCategory === 'all' || part.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || part.status === filterStatus;
    const matchesSearch = part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.partID.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.supplier.toLowerCase().includes(searchTerm.toLowerCase());
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
  const inStockParts = parts.filter(p => p.status === 'in_stock').length;
  const lowStockParts = parts.filter(p => p.status === 'low_stock').length;
  const outOfStockParts = parts.filter(p => p.status === 'out_of_stock').length;
  const totalValue = parts.reduce((sum, part) => sum + (part.price * part.quantity), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
          <button
            onClick={handleAddPart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phụ tùng</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-xl mr-4">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{formatPrice(totalValue)}</h3>
              <p className="text-gray-600 text-sm">Tổng giá trị</p>
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
            <option value="all">Tất cả trạng thái</option>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà cung cấp</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParts.map((part) => {
                const StatusIcon = getStatusIcon(part.status);
                return (
                  <tr key={part.partID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.partID}</div>
                        <div className="text-sm text-gray-500">{part.partName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {part.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(part.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{part.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(part.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusText(part.status)}
                      </span>
                    </td>
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
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã phụ tùng</label>
                    <input
                      type="text"
                      defaultValue={selectedPart?.partID || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="P001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <select
                      defaultValue={selectedPart?.category || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    type="text"
                    defaultValue={selectedPart?.partName || ''}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên phụ tùng"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                    <input
                      type="number"
                      defaultValue={selectedPart?.price || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                    <input
                      type="number"
                      defaultValue={selectedPart?.quantity || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nhà cung cấp</label>
                    <select
                      defaultValue={selectedPart?.supplier || ''}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers.map(supplier => (
                        <option key={supplier} value={supplier}>{supplier}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      defaultValue={selectedPart?.status || 'in_stock'}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="in_stock">Còn hàng</option>
                      <option value="low_stock">Sắp hết</option>
                      <option value="out_of_stock">Hết hàng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedPart?.description || ''}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mô tả chi tiết về phụ tùng"
                  />
                </div>
              </form>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedPart ? 'Cập nhật' : 'Thêm mới'}
              </button>
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
                  <p className="mb-2"><strong>Mã:</strong> {selectedPart.partID}</p>
                  <p className="mb-2"><strong>Tên:</strong> {selectedPart.partName}</p>
                  <p className="mb-2"><strong>Danh mục:</strong> {selectedPart.category}</p>
                  <p className="mb-0"><strong>Giá:</strong> {formatPrice(selectedPart.price)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Kho & Trạng thái</h4>
                  <p className="mb-2"><strong>Số lượng:</strong> {selectedPart.quantity}</p>
                  <p className="mb-2"><strong>Nhà cung cấp:</strong> {selectedPart.supplier}</p>
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
                    <p className="mb-2"><strong>Tổng giá trị:</strong> {formatPrice(selectedPart.price * selectedPart.quantity)}</p>
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