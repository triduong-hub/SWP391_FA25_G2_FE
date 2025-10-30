import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Loader2 } from "lucide-react";

// Rule-based responses (fully local, no backend)
const normalizeText = (text) => {
  return text
    .normalize("NFD") // separate accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " ") // normalize spaces
    .toLowerCase()
    .trim();
};

const matches = (text, patterns) => {
  const normalized = normalizeText(text);
  return patterns.some((pattern) => {
    // Remove spaces and accents for fuzzy match
    const cleaned = normalized.replace(/\s+/g, "");
    const cleanedPattern = pattern.replace(/\s+/g, "");
    return cleaned.includes(cleanedPattern);
  });
};

const getRuleBasedResponse = (message) => {
  const text = normalizeText(message);

  const greeting = ["xin chao", "chao", "hello", "hi", "hey"];
  const booking = ["dat lich", "booking", "hen lich", "dang ky lich", "schedule", "book"];
  const payment = ["thanh toan", "payment", "tra tien", "hoa don", "bill", "pay"];
  const maintenance = ["bao duong", "service", "kiem tra xe", "sua xe", "repair", "maintain"];
  const battery = ["pin", "battery", "sac", "nang luong", "energy", "charge", "charging"];
  const support = ["ho tro", "help", "support", "tu van", "lien he", "contact", "problem", "issue"];
  const history = ["lich su", "history", "don hang", "booking history", "past service"];

  // always return an array of responses
  if (matches(text, greeting)) {
    return ["Xin chào! Tôi có thể giúp bạn đặt lịch, thanh toán, hoặc kiểm tra bảo dưỡng."];
  }
  if (matches(text, booking)) {
    return [
      'Bạn có thể đặt lịch bảo dưỡng tại đây: <a href="/booking" target="_blank" style="color:#2563eb; text-decoration:underline;">Đặt lịch ngay</a>',
    ];
  }
  if (matches(text, payment)) {
    return ["Bạn muốn thanh toán dịch vụ nào? Vui lòng cung cấp mã đơn hàng hoặc chọn từ danh sách."];
  }
  if (matches(text, maintenance)) {
    return ["Xe của bạn cần kiểm tra hay bảo dưỡng? Tôi có thể giúp bạn đặt lịch ngay."];
  }
  if (matches(text, battery)) {
    return ["Bạn muốn kiểm tra tình trạng pin hay tình trạng sạc?"];
  }
  if (matches(text, support)) {
    return ["Vui lòng mô tả vấn đề bạn đang gặp. Nhân viên kỹ thuật sẽ hỗ trợ sớm nhất có thể."];
  }
  if (matches(text, history)) {
    return ["Bạn có thể xem lịch sử đặt dịch vụ và đơn hàng của mình trong phần 'Lịch sử dịch vụ'."];
  }

  return ["Xin lỗi, tôi chưa hiểu rõ yêu cầu. Bạn có thể nói cụ thể hơn không?"];
};


// ✅ Quick replies for convenience
const QUICK_REPLIES = [
  "Bảo dưỡng / Service",
  "Đặt lịch / Booking",
  "Thanh toán / Payment",
  "Hỗ trợ / Support",
  "Kiểm tra pin / Battery Check",
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message (fully local)
  const sendMessage = (customMsg) => {
    const msg = customMsg || input;
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate a delay for realism
    setTimeout(() => {
      const replies = getRuleBasedResponse(msg);
      setMessages((prev) => [
        ...prev,
        ...replies.map((r) => ({ sender: "bot", text: r })),
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 p-4 rounded-full shadow-lg text-white hover:bg-blue-700 transition-all"
        >
          <Bot className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-80 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-2xl">
            <h3 className="font-semibold">EV Care ChatBot</h3>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat body */}
          <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm max-w-[75%] break-words ${
                  m.sender === "bot"
                    ? "bg-gray-100 text-gray-800 self-start"
                    : "bg-blue-600 text-white self-end ml-auto"
                }`}
              >
                {m.sender === "bot" ? (
                  <div dangerouslySetInnerHTML={{ __html: m.text }} />
                ) : (
                  m.text
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang phản hồi...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="flex flex-wrap gap-1 px-2 pb-2 border-t border-gray-100">
            {QUICK_REPLIES.map((text, i) => (
              <button
                key={i}
                onClick={() => sendMessage(text)}
                className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1 hover:bg-blue-100 hover:text-blue-700 transition"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center border-t border-gray-200 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 text-sm outline-none px-2 py-1"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className={`p-2 ${
                loading ? "text-gray-400" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
