<<<<<<< Updated upstream
import React, { useState } from "react";
import { Send, Bot, X } from "lucide-react";
=======
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Loader2 } from "lucide-react";
>>>>>>> Stashed changes

// ✅ Simple rule-based fallback responses
const getRuleBasedResponse = (message) => {
  const text = message.toLowerCase();

  if (text.includes("xin chào") || text.includes("chào")) {
    return "Xin chào! Tôi có thể giúp bạn đặt lịch, thanh toán, hoặc kiểm tra bảo dưỡng.";
  } else if (text.includes("đặt lịch") || text.includes("booking")) {
    return "Bạn muốn đặt lịch bảo dưỡng hay sửa chữa? Vui lòng cung cấp biển số hoặc mã xe.";
  } else if (text.includes("thanh toán") || text.includes("payment")) {
    return "Bạn có thể thanh toán trực tuyến qua ví điện tử hoặc tại trung tâm dịch vụ.";
  } else if (text.includes("bảo dưỡng") || text.includes("service")) {
    return "Lịch bảo dưỡng định kỳ được gợi ý mỗi 5,000 km hoặc 6 tháng một lần.";
  } else if (text.includes("pin") || text.includes("battery")) {
    return "Tình trạng pin ổn định nếu mức suy giảm dưới 20%. Cần thay nếu trên 30%.";
  } else if (text.includes("hỗ trợ") || text.includes("help")) {
    return "Tôi có thể hỗ trợ bạn về đặt lịch, bảo dưỡng, thanh toán, hoặc tình trạng xe.";
  } else {
    return "Xin lỗi, tôi chưa hiểu rõ yêu cầu. Bạn có thể nói cụ thể hơn không?";
  }
};

// ✅ Quick replies for convenience
const QUICK_REPLIES = [
  "Đặt lịch bảo dưỡng",
  "Thanh toán dịch vụ",
  "Kiểm tra tình trạng pin",
  "Lịch sử bảo dưỡng",
  "Hỗ trợ kỹ thuật",
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
  ]);
  const [input, setInput] = useState("");
<<<<<<< Updated upstream

    const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { sender: "user", text: input };
    setMessages([...messages, newMsg]);
=======
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async (customMsg) => {
    const msg = customMsg || input;
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
>>>>>>> Stashed changes
    setInput("");
    setLoading(true);

    try {
        const res = await fetch("http://localhost:8080/api/chat/customer", {
        method: "POST",
<<<<<<< Updated upstream
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
        });
        const data = await res.json();

        setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "Không nhận được phản hồi từ máy chủ." },
        ]);
    } catch (err) {
        setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Lỗi kết nối máy chủ. Vui lòng thử lại sau." },
        ]);
=======
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });

      if (res.status === 401) throw new Error("401");

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "❔ Không nhận được phản hồi từ máy chủ.",
        },
      ]);
    } catch (error) {
      console.error("ChatBot error:", error);

      if (error.message === "401") {
        const fallbackReply = getRuleBasedResponse(msg);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: fallbackReply + " (Chế độ dự phòng)" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `⚠️ Lỗi: ${
              error.message || "Không thể kết nối tới máy chủ."
            }`,
          },
        ]);
      }
    } finally {
      setLoading(false);
>>>>>>> Stashed changes
    }
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
                className={`p-2 rounded-lg text-sm max-w-[75%] ${
                  m.sender === "bot"
                    ? "bg-gray-100 text-gray-800 self-start"
                    : "bg-blue-600 text-white self-end ml-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
<<<<<<< Updated upstream
          </div>

=======
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
>>>>>>> Stashed changes
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
