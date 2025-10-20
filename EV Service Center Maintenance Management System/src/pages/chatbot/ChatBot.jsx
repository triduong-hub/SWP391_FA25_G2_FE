import React, { useState } from "react";
import { Send, Bot, X } from "lucide-react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
  ]);
  const [input, setInput] = useState("");

    const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { sender: "user", text: input };
    setMessages([...messages, newMsg]);
    setInput("");

    try {
        const res = await fetch("http://localhost:8080/api/chat/customer", {
        method: "POST",
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
            <h3 className="font-semibold">EV Care Chatbot</h3>
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
              onClick={sendMessage}
              className="text-blue-600 hover:text-blue-800 p-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
