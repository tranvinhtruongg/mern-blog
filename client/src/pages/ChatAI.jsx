import {GoogleGenerativeAI} from '@google/generative-ai'
import  { useState, useRef, useEffect } from "react";
import { useSelector } from 'react-redux';
import ChatHistory from '../conponents/ChatHistory';
import Loading from '../conponents/Loading';

export default function ChatAI() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef(null);  // Ref để tham chiếu đến phần container chat

  // Lấy theme từ Redux
  const theme = useSelector((state) => state.theme.theme);

  const genAI = new GoogleGenerativeAI('AIzaSyC00OpJIl4B5vHdVMCdVIhJODYrSJuCsS4');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    setIsLoading(true);
    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      setChatHistory([
        ...chatHistory,
        { type: 'user', message: userInput },
        { type: 'bot', message: response.text() },
      ]);
    } catch {
      console.error('Error sending message');
    } finally {
      setUserInput('');
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  // Cuộn tự động xuống dưới mỗi khi chatHistory thay đổi
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);  // Khi chatHistory thay đổi, cuộn xuống dưới

  return (
    <div className={`container mx-auto px-6 py-10 flex flex-col min-h-screen bg-${theme === 'light' ? 'gray-50' : 'gray-900'}`}>
      <div className="flex-grow flex flex-col justify-between">
        <div 
          className={`chat-container flex-grow rounded-xl shadow-lg p-6 bg-${theme === 'light' ? 'white' : 'gray-800'} overflow-y-auto`}
          ref={chatContainerRef}
          style={{ maxHeight: '70vh' }} // Bạn có thể điều chỉnh chiều cao tối đa theo ý muốn
        >
          <ChatHistory chatHistory={chatHistory} />
          <Loading isLoading={isLoading} />
        </div>

        {/* Điều chỉnh phần này để sát với phần chat */}
        <div className="-mt-4"> {/* Thay đổi từ mt-4 thành -mt-2 hoặc loại bỏ hoàn toàn */}
          <div className="flex mb-4 space-x-4">
            <input
              type="text"
              className={`flex-grow px-4 py-3 rounded-lg border text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              placeholder="Type your message..."
              value={userInput}
              onChange={handleUserInput}
            />
            <button
              className={`px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none transition-all ${theme === 'dark' ? 'bg-blue-500' : ''}`}
              onClick={sendMessage}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
          <button
            className={`block w-full px-6 py-3 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none transition-all ${theme === 'dark' ? 'bg-gray-700' : ''}`}
            onClick={clearChat}
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}