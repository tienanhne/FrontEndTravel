/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: string; message: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "Địa điểm du lịch nổi tiếng tại Đà Nẵng là gì?",
    "Tôi nên đi du lịch Phú Quốc vào mùa nào?",
    "Có những món đặc sản nào ở Hà Nội?",
    "Tư vấn lịch trình 3 ngày 2 đêm tại Đà Lạt?",
    "Thời tiết ở Sapa hôm nay như thế nào?",
  ];

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBNIJJOc3-pBa2RqMA_Pqtx3aSPufcm5Hs"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSend = async (message: string) => {
    if (message.trim() === "") return;
    setIsTyping(true);
    try {
      const result = await model.generateContent(message);
      const response = result.response;
      console.log(response);

      setMessages([
        ...messages,
        { type: "user", message: input },
        { type: "bot", message: response.text() },
      ]);
      setInput("")
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
      setInput("")
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 z-50">
      <button
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition duration-300"
      >
        <FaCommentDots size={24} />
      </button>

      {isOpen && (
        <div className="relative w-80 h-96 bg-white border shadow-lg rounded-lg mt-2 p-4 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Live Chat</h2>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700"
            >
              <BsThreeDotsVertical size={20} />
            </button>
            {isMenuOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white shadow-lg border rounded-lg py-2 z-50">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Kết bạn
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Tạo mới đoạn chat
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, idx) => (
              <p
                key={idx}
                className={`text-sm p-2 rounded-md ${
                  msg.type === "user"
                    ? "text-gray-800 bg-blue-100 self-end"
                    : "text-gray-500 bg-gray-100"
                }`}
              >
                {msg.message}
              </p>
            ))}
            {isTyping && (
              <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
                Gemini is typing...
              </p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Câu hỏi gợi ý:</h3>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap ">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(question)}
                  className="bg-gray-200 hover:bg-gray-300 text-sm py-1 px-3 rounded-full flex-shrink-0"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Bạn muốn nói gì..."
              value={input}
              onKeyDown={handleKeyDown}

              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-md p-3 focus:outline-none"
            />
            <button
              onClick={() => handleSend(input)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full flex-shrink-0"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
