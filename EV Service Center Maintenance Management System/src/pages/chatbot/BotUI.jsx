import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi là trợ lý EV của bạn 🚗⚡" },
  ]);

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async (msg) => {
    const newMessages = [...messages, { sender: "user", text: msg }];
    setMessages(newMessages);

    // Later this will call backend
    // const res = await fetch("/api/chat/customer", {...})
    // const data = await res.json();

    const mockReply = "Tôi đã ghi nhận yêu cầu của bạn. (Đang kết nối AI...)";
    setTimeout(() => {
      setMessages([...newMessages, { sender: "bot", text: mockReply }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border rounded-2xl shadow bg-white">
      <div className="p-3 border-b font-semibold text-lg bg-blue-50 text-blue-700">
        Trợ lý EV Service 🤖
      </div>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} sender={m.sender} text={m.text} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatbotUI;
