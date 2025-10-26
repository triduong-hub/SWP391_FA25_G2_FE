import React from "react";

const ChatMessage = ({ sender, text }) => {
  const isUser = sender === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`rounded-2xl px-4 py-2 max-w-[70%] shadow
          ${isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}
        `}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;