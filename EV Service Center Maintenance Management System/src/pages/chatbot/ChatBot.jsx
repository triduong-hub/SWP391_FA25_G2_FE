import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Loader2 } from "lucide-react";

const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
};

const matches = (text, patterns) => {
  const normalized = normalizeText(text);
  return patterns.some((pattern) => {
    const cleaned = normalized.replace(/\s+/g, "");
    const cleanedPattern = pattern.replace(/\s+/g, "");
    return cleaned.includes(cleanedPattern);
  });
};

const ChatBot = ({ bookings = [] }) => {
  const getRuleBasedResponse = (message) => {
  const text = normalizeText(message);

  const greeting = ["xin chao", "chao", "hello", "hi", "hey"];
  const booking = ["dat lich", "booking", "hen lich", "dang ky lich", "schedule", "book"];
  const payment = ["thanh toan", "payment", "tra tien", "hoa don", "bill", "pay"];
  const maintenance = ["bao duong", "service", "kiem tra xe", "sua xe", "repair", "maintain"];
  const battery = ["pin", "battery", "sac", "nang luong", "energy", "charge", "charging"];
  const support = ["ho tro", "help", "support", "tu van", "lien he", "contact", "problem", "issue"];
  const history = ["lich su", "history", "don hang", "booking history", "past service"];

  if (matches(text, greeting)) {
    return ["Xin chào! Tôi có thể giúp bạn đặt lịch, thanh toán, hoặc kiểm tra bảo dưỡng."];
  }

  if (matches(text, booking)) {
    return [
      'Xe của bạn cần kiểm tra hay bảo dưỡng? Bạn có thể đặt lịch bảo dưỡng tại đây: <booking-link>Đặt lịch ngay</booking-link>',
    ];
  }

  if (matches(text, payment)) {
    if (!bookings || bookings.length === 0) {
      return ["Bạn chưa có đơn đặt lịch nào cả."];
    }

    // 🔹 Status translation (English → Vietnamese)
    const statusMapServerToUI = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      "in progress": "Đang thực hiện",
      awaiting_customer_approval: "Chờ khách xác nhận báo giá",
      approved: "Đã duyệt",
      "waiting for payment": "Chờ thanh toán",
      completed: "Hoàn tất",
      processing: "Khách đã xác nhận",
    };

    // 🔹 Count bookings by status
    const statusCount = {};
    bookings.forEach((b) => {
      const s = (b.status || "khác").toLowerCase();
      statusCount[s] = (statusCount[s] || 0) + 1;
    });

    const summaryLines = Object.entries(statusCount)
      .map(([status, count]) => {
        const vietnamese =
          statusMapServerToUI[status] || status.replace(/_/g, " ");
        return `• ${count} mã đơn đang ở trạng thái: ${vietnamese}`;
      })
      .join("<br/>");

    return [
      `💳 Dưới đây là tóm tắt về thanh toán của bạn:<br/>
      ✔️ Thanh toán online qua thẻ hoặc ví điện tử<br/>
      ✔️ Hỗ trợ thanh toán tại trung tâm sau khi hoàn tất dịch vụ<br/>
      ✔️ Bạn có thể xem hóa đơn và chi tiết tại mục "Đơn đặt lịch của bạn"<br/><br/>
      📦 <b>Bạn hiện đang có ${bookings.length} mã đơn:</b><br/>${summaryLines}<br/><br/>
      Vui lòng xem 'Đơn đặt lịch của bạn' để xem chi tiết và thanh toán.`,
    ];
  }

  if (matches(text, maintenance)) {
    return ["Xe của bạn cần kiểm tra hay bảo dưỡng? Tôi có thể giúp bạn đặt lịch ngay."];
  }

  if (matches(text, battery)) {
    return ["Bạn muốn kiểm tra tình trạng pin hay tình trạng sạc?"];
  }

  if (matches(text, support)) {
    return ["Vui lòng liên hệ tại đây<br/>📞 0906 791 084<br/> 📧 dinhtri110105@gmail.com"];
  }

  if (matches(text, history)) {
    return ["Bạn có thể xem lịch sử đặt dịch vụ và đơn hàng của mình trong phần 'Lịch sử dịch vụ'."];
  }

  return ["Xin lỗi, tôi chưa hiểu rõ yêu cầu. Bạn có thể nói cụ thể hơn không?"];
};

  const QUICK_REPLIES = ["Đặt lịch / Booking", "Thanh toán / Payment", "Hỗ trợ / Support"];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBookingClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/booking";
    } else {
      alert("⚠️ Bạn cần đăng nhập trước đã!");
      window.location.href = "/login";
    }
  };

  const renderBotMessage = (text) => {
    if (text.includes("<booking-link>")) {
      const parts = text.split(/<booking-link>|<\/booking-link>/);
      return (
        <div>
          {parts.map((part, index) =>
            index === 1 ? (
              <button
                key={index}
                onClick={handleBookingClick}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {part}
              </button>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </div>
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  const sendMessage = (customMsg) => {
    const msg = customMsg || input;
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

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
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-2xl">
            <h3 className="font-semibold">EV Care ChatBot</h3>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

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
                {m.sender === "bot" ? renderBotMessage(m.text) : m.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang phản hồi...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

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
