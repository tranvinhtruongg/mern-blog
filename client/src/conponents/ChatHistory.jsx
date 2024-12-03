import ReactMarkdown from 'react-markdown';

const ChatHistory = ({ chatHistory }) => {
  return (
    <div className="p-4 space-y-4">
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-2/3 p-3 rounded-lg ${message.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
