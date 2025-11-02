import React, { useState, useEffect } from "react";

const SystemManagement = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 min-h-screen rounded-2xl space-y-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">
        ⚙️ Cấu hình chung hệ thống
      </h2>
      <GeneralSettings />
    </div>
  );
};

// ==================== CẤU HÌNH CHUNG ====================
const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    systemName: "",
    contactEmail: "",
    logoUrl: "",
  });

  useEffect(() => {
    setSettings({
      systemName: "EV Service Center",
      contactEmail: "support@evcenter.com",
      logoUrl: "",
    });
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("💾 Đã lưu cấu hình!");
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-xl shadow p-6 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm text-gray-600">Tên hệ thống</label>
        <input
          type="text"
          name="systemName"
          value={settings.systemName}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Email liên hệ</label>
        <input
          type="email"
          name="contactEmail"
          value={settings.contactEmail}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Logo (URL)</label>
        <input
          type="text"
          name="logoUrl"
          value={settings.logoUrl}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:opacity-90 text-white px-4 py-2 rounded-xl shadow"
      >
        Lưu thay đổi
      </button>
    </div>
  );
};

export default SystemManagement;
