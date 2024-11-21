import {GoogleGenerativeAI} from '@google/generative-ai'
import  { useState, useEffect } from "react";
import ChatHistory from '../conponents/ChatHistory';
import Loading from '../conponents/Loading';

export default function ChatAI() {
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const genAI = new GoogleGenerativeAI(
        "AIzaSyAHxELZh7-n2PlkW363RMBjL1XQYyk4o1w"
      );
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const handleUserInput = (e) => {
        setUserInput(e.target.value);
      };
    
      // Function to send user message to Gemini
    const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
        // call Gemini Api to get a response
        const result = await model.generateContent(userInput);
        const response = await result.response;
        console.log(response);
        // add Gemeni's response to the chat history
        setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
        ]);
    } catch {
        console.error("Error sending message");
    } finally {
        setUserInput("");
        setIsLoading(false);
    }
    };
        // Function to clear the chat history
    const clearChat = () => {
        setChatHistory([]);
    };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">ChatTVT</h1>

      <div className="chat-container rounded-lg shadow-md p-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Gửi
        </button>
      </div>
      <button
        className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
        onClick={clearChat}
      >
        Xóa Chat
      </button>
    </div>
  );
}
