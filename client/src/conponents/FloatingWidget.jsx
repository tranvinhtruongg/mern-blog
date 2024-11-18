// FloatingWidget.jsx
import  { useState, useEffect } from 'react';

function FloatingWidget() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4">
      {/* Zalo Button */}
      <a 
        href="https://zalo.me" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="bg-blue-500 p-3 rounded-full shadow-lg border-4 border-blue-100 floating-button"
      >
        <img src="zl.png" alt="Zalo" className="w-8 h-8 pulse" />
      </a>

      {/* Email Button */}
      <a 
        href="mailto:tranvinhtruong1101@gmail.com" 
        className="bg-white p-3 rounded-full shadow-lg border-4 border-green-100 floating-button"
      >
        <img src="thumbnail.png" alt="Email" className="w-8 h-8 pulse" />
      </a>

      {/* Messenger Button */}
      <a 
        href="https://m.me" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="bg-gradient-to-br from-blue-500 to-pink-500 p-3 rounded-full shadow-lg border-4 border-blue-100 floating-button"
      >
        <img src="ic-msg.png" alt="Messenger" className="w-8 h-8 pulse" />
      </a>

      {/* Back to Top Button */}
      {showScrollToTop && (
        <button 
          onClick={scrollToTop} 
          className="m-2 bg-gray-500 rounded-full shadow-lg text-white w-12 h-12 flex items-center justify-center floating-button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="3" 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default FloatingWidget;
