import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setIsMenuOpen(false); 
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-4 z-50">
      {/* Button to open/close the chat */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition duration-300"
      >
        <FaCommentDots size={24} />
      </button>

      {/* Chat box */}
      {isOpen && (
        <div className="relative w-80 h-96 bg-white border shadow-lg rounded-lg mt-2 p-4 flex flex-col justify-between">
          {/* Chat Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-lg font-semibold">Live Chat</h2>
            {/* Three dots menu button */}
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700">
              <BsThreeDotsVertical size={20} />
            </button>
            {/* Dropdown menu */}
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

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {/* Sample messages */}
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">
              Hello! How can I help you?
            </p>
            <p className="text-sm text-gray-800 bg-blue-100 p-2 rounded-md self-end">
              Hi, I have a question about your services.
            </p>
            {/* More messages can be added here */}
          </div>

          {/* Chat Input */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Bạn muốn nói gì..."
              className="flex-1 border rounded-md p-3 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full flex-shrink-0">
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
