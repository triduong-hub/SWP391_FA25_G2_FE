import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t p-3 bg-white"
    >
      <input
        type="text"
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nhập tin nhắn..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;
