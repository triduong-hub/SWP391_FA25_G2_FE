import React, { useState } from "react";
import { Bot, Loader2, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import api from "../../../../api";

const AIMinStock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [partCode, setPartCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null);
    setResult(null);
  };

  // ✅ Fetch AI suggestion
  const fetchSuggestion = async () => {
    if (!partCode.trim()) {
      setError("Vui lòng nhập mã phụ tùng (VD: PC003, PA001).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/ai/parts/suggested-min/${partCode}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể lấy dữ liệu gợi ý từ AI. Vui lòng kiểm tra mã phụ tùng.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Apply AI suggestion
  const applySuggestion = async () => {
    if (!result) return;

    try {
      await api.post(`/ai/parts/apply-suggested-min/${partCode}`, {
        suggestedMin: result.suggestedMin,
      });
      alert("✅ Đã cập nhật số lượng tối thiểu theo gợi ý AI!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật số lượng tối thiểu.");
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* AI Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white shadow-xl rounded-xl w-96 border border-gray-200 overflow-hidden z-50">
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <h2 className="font-semibold text-lg">AI Gợi ý tồn tối thiểu</h2>
            </div>
            <button onClick={toggleChat}>
              <XCircle className="w-5 h-5 text-white hover:text-gray-200" />
            </button>
          </div>

          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập <strong>mã phụ tùng</strong>:
            </label>
            <input
              type="text"
              value={partCode}
              onChange={(e) => setPartCode(e.target.value.toUpperCase())}
              placeholder="VD: PC003, PA001"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={fetchSuggestion}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang phân tích...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" /> Phân tích AI
                </>
              )}
            </button>

            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

            {result && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📊 Kết quả đề xuất
                </h3>
                <p className="text-sm mb-1">
                  <strong>Min hiện tại:</strong> {result.currentMin}
                </p>
                <p className="text-sm mb-1">
                  <strong>Trung bình/ngày:</strong> {result.avgDaily.toFixed(2)}
                </p>
                <p className="text-sm mb-1">
                  <strong>Dự báo ({result.lookbackDays} ngày):</strong>{" "}
                  {result.forecast}
                </p>
                <p className="text-sm mb-1">
                  <strong>Tồn an toàn:</strong> {result.safetyStock}
                </p>
                <p className="text-sm mb-1">
                  <strong>Buffer:</strong> {result.buffer}
                </p>

                <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="font-medium text-green-700">
                    Gợi ý tồn tối thiểu: {result.suggestedMin}
                  </p>
                </div>

                <button
                  onClick={applySuggestion}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Áp dụng gợi ý
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIMinStock;
