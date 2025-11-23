import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
    Search, Package, AlertTriangle, Filter, 
    Plus, Edit, Trash2, X, Save, UploadCloud, MapPin, Building2 
} from "lucide-react";
import api from "../../../../api"; 
import { toast } from "react-toastify"; 
import AIMinStock from "../components/AIMinStock";

const AdminInventory = () => {
    // --- STATE ---
    const [components, setComponents] = useState([]);
    const [serviceCenters, setServiceCenters] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterServiceCenter, setFilterServiceCenter] = useState("all");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); 
    const [selectedComponent, setSelectedComponent] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        type: "",
        description: "",
        price: 0,
        quantity: 0,
        minQuantity: 5,
        supplierName: "",
        image: null, 
        serviceCenterId: "", 
    });
    const [previewImage, setPreviewImage] = useState("");

    // --- FETCH DATA ---
    const fetchAllData = async () => {
        setLoading(true);
        try {
            // 1. Lấy danh sách Service Centers 
            const resCenters = await api.get("/service-centers/getAll");
            setServiceCenters(Array.isArray(resCenters.data) ? resCenters.data : []);

            // 2. Lấy TOÀN BỘ linh kiện
            const resComponents = await api.get("/components/getAll");
            let data = Array.isArray(resComponents.data) ? resComponents.data : [];
            
            //Sắp xếp: ID lớn nhất (mới nhất)
            data.sort((a, b) => b.componentID - a.componentID);
            
            setComponents(data);
        } catch (err) {
            console.error("❌ Lỗi tải dữ liệu:", err);
            setServiceCenters([]); 
            setComponents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // --- HANDLERS ---

    const handleOpenCreate = () => {
        setModalMode("create");
        setFormData({
            name: "", code: "", type: "", description: "",
            price: 0, quantity: 0, minQuantity: 5, supplierName: "",
            image: null,
            // Mặc định chọn chi nhánh đầu tiên nếu có
            serviceCenterId: serviceCenters.length > 0 ? serviceCenters[0].serviceCenterID : ""
        });
        setPreviewImage("");
        setIsModalOpen(true);
    };

    const handleOpenEdit = (comp) => {
        setModalMode("edit");
        setSelectedComponent(comp);
        setFormData({
            name: comp.name,
            code: comp.code,
            type: comp.type,
            description: comp.description || "",
            price: comp.price,
            quantity: comp.quantity,
            minQuantity: comp.minQuantity,
            supplierName: comp.supplierName || "",
            image: null,
            serviceCenterId: comp.serviceCenterID || (serviceCenters.length > 0 ? serviceCenters[0].serviceCenterID : "")
        });
        setPreviewImage(comp.imageUrl);
        setIsModalOpen(true);
    };

    const handleOpenDelete = (comp) => {
        setSelectedComponent(comp);
        setIsDeleteConfirmOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // --- SUBMIT (CREATE / UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!formData.serviceCenterId) {
            toast.error("Vui lòng chọn chi nhánh kho!");
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("code", formData.code);
            data.append("type", formData.type);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("quantity", formData.quantity);
            data.append("minQuantity", formData.minQuantity);
            data.append("supplierName", formData.supplierName);
            data.append("serviceCenterID", formData.serviceCenterId);
            if (formData.image instanceof File) {
                data.append("image", formData.image);
            }

            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };

            if (modalMode === "create") {
                await api.post("/components/create", data, config);
                toast.success("Tạo linh kiện thành công!");
            } else {
                await api.put(`/components/update/${selectedComponent.componentID}`, data, config);
                toast.success("Cập nhật thành công!");
            }
            
            setIsModalOpen(false);
            fetchAllData(); // Tải lại dữ liệu
        } catch (err) {
            console.error("Lỗi submit:", err);
            const msg = err.response?.data || "Có lỗi xảy ra";
            toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        }
    };

    // --- DELETE ---
    const handleDelete = async () => {
        try {
            await api.delete(`/components/delete/${selectedComponent.componentID}`);
            toast.success("Đã xóa linh kiện!");
            setIsDeleteConfirmOpen(false);
            fetchAllData();
        } catch (err) {
            console.error("Lỗi xóa:", err);
            toast.error("Không thể xóa linh kiện này.");
        }
    };

    // --- FILTER LOGIC ---
    const filteredComponents = components.filter((item) => {
    const term = searchTerm.toLowerCase();

    const matchSearch =
        item.name?.toLowerCase().includes(term) ||
        item.code?.toLowerCase().includes(term) ||
        item.serviceCenterName?.toLowerCase().includes(term);

    const matchType = filterType === "all" || item.type === filterType;
    const matchServiceCenter =
        filterServiceCenter === "all" ||
        String(item.serviceCenterID) === String(filterServiceCenter);

    return matchSearch && matchType && matchServiceCenter;
});

    const componentTypes = ["all", ...new Set(components.map((c) => c.type).filter(Boolean))];

    // --- RENDER ---
    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            
            {/* HEADER & TOOLBAR */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="text-emerald-600" /> Quản lý Kho Tổng (Admin)
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Quản lý toàn bộ linh kiện trên tất cả chi nhánh
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto flex-wrap md:flex-nowrap">
                    {/* Search */}
                    <div className="relative flex-1 md:min-w-[250px]">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm tên, mã, chi nhánh..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={filterServiceCenter}
                            onChange={(e) => setFilterServiceCenter(e.target.value)}
                            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none w-full sm:w-auto"
                        >
                            <option value="all">Tất cả chi nhánh</option>
                            {serviceCenters.map((center) => (
                                <option key={center.serviceCenterID} value={center.serviceCenterID}>
                                    {center.name}
                                </option>
                            ))}
                        </select>
                        <Building2 className="absolute left-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                        <Filter className="absolute right-2 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Filter Type */}
                    <div className="relative">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none"
                        >
                            {componentTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type === "all" ? "Tất cả loại" : type}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-2 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Add Button */}
                    <button 
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" /> Thêm mới
                    </button>
                </div>
            </div>

            {/* LIST CONTENT */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            ) : filteredComponents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Không tìm thấy dữ liệu linh kiện.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredComponents.map((item) => {
                        const isLowStock = item.quantity <= (item.minQuantity || 5);
                        return (
                            <div
                                key={item.componentID}
                                className={`group relative bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-lg flex flex-col overflow-hidden ${
                                    isLowStock ? "border-orange-300 ring-1 ring-orange-100" : "border-gray-200"
                                }`}
                            >
                                {/* Action Buttons Overlay */}
                                <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenEdit(item)}
                                        className="p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50"
                                        title="Sửa"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleOpenDelete(item)}
                                        className="p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Image Area */}
                                <div className="h-48 w-full bg-gray-100 relative">
                                    <img
                                        src={item.imageUrl || "https://placehold.co/300x200?text=No+Image"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = "https://placehold.co/300x200?text=Error"; }}
                                    />
                                    
                                    {/* ✅ HIỂN THỊ TÊN CHI NHÁNH */}
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                                        <p className="text-white text-xs flex items-center gap-1 font-medium">
                                            <MapPin className="w-3 h-3 text-emerald-400" /> 
                                            {item.serviceCenterName || "Chưa rõ chi nhánh"}
                                        </p>
                                    </div>

                                    {isLowStock && (
                                        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                                            <AlertTriangle className="w-3 h-3" /> Low Stock
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                            {item.code}
                                        </span>
                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                            {item.type}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-bold text-gray-800 mt-1 text-lg line-clamp-1" title={item.name}>
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-2 h-10">
                                        {item.description || "Không có mô tả"}
                                    </p>

                                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-500">Số lượng</p>
                                            <p className={`font-bold text-lg ${isLowStock ? "text-orange-600" : "text-gray-800"}`}>
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Đơn giá</p>
                                            <p className="font-bold text-lg text-blue-600">
                                                {item.price?.toLocaleString()} đ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- CREATE / EDIT MODAL (PORTAL) --- */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                {modalMode === "create" ? <Plus className="text-emerald-600"/> : <Edit className="text-blue-600"/>}
                                {modalMode === "create" ? "Thêm linh kiện mới" : "Cập nhật linh kiện"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="flex gap-6">
                                {/* Image Upload */}
                                <div className="w-1/3">
                                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center relative group">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-gray-400 p-2">
                                                <UploadCloud className="w-8 h-8 mx-auto mb-1"/>
                                                <span className="text-xs">Chọn ảnh</span>
                                            </div>
                                        )}
                                        
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            title="Nhấn để thay đổi ảnh"
                                        />
                                        
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <span className="bg-black/50 px-2 py-1 rounded text-xs">Thay đổi ảnh</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-2/3 space-y-3">
                                    {/* ✅ SERVICE CENTER DROPDOWN */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Chi nhánh kho <span className="text-red-500">*</span></label>
                                        <select
                                            name="serviceCenterId"
                                            value={formData.serviceCenterId}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                        >
                                            <option value="">-- Chọn chi nhánh --</option>
                                            {serviceCenters.map(center => (
                                                <option key={center.serviceCenterID} value={center.serviceCenterID}>
                                                    {center.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã linh kiện</label>
                                            <input
                                                name="code"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                                            <input
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="VD: Pin, Lốp..."
                                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên linh kiện</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
                                        <input
                                            name="supplierName"
                                            value={formData.supplierName}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VND)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mức tối thiểu</label>
                                    <input
                                        type="number"
                                        name="minQuantity"
                                        value={formData.minQuantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium flex items-center gap-2 shadow-lg shadow-emerald-200"
                                >
                                    <Save className="w-5 h-5" />
                                    {modalMode === "create" ? "Tạo mới" : "Lưu thay đổi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* --- DELETE MODAL (PORTAL) --- */}
            {isDeleteConfirmOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center animate-fadeIn">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận xóa?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Bạn có chắc chắn muốn xóa linh kiện <span className="font-bold text-gray-800">{selectedComponent?.name}</span>? 
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                            >
                                Xóa ngay
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <AIMinStock />
        </div>
    );
};

export default AdminInventory;