import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function NotFound() {
  const { theme } = useSelector((state) => state.theme); // Lấy trạng thái theme từ Redux

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'
      }`}
    >
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-4">Trang bạn tìm kiếm không tồn tại.</p>
      <Link
        to="/"
        className={`px-4 py-2 rounded ${
          theme === 'light'
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-blue-700 text-white hover:bg-blue-800'
        }`}
      >
        Quay lại Trang chủ
      </Link>
    </div>
  );
}
