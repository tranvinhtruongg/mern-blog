// src/components/ResetPassword.jsx
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Thêm các icon từ react-icons
import { Button } from "flowbite-react"; // Import Button từ flowbite-react

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái hiển thị mật khẩu

  const query = new URLSearchParams(location.search);
  const oobCode = query.get("oobCode");

  const handleResetPassword = async () => {
    const auth = getAuth();

    try {
      if (!oobCode) {
        setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
        return;
      }

      if (newPassword.length < 6) {
        setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
        return;
      }

      setIsLoading(true);
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Đặt lại mật khẩu thành công! Chuyển hướng đến trang đăng nhập...");
      setError("");

      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (err) {
      console.error("Lỗi chi tiết:", err.code, err.message);

      if (err.code === "auth/expired-action-code") {
        setError("Liên kết đặt lại mật khẩu đã hết hạn.");
      } else if (err.code === "auth/invalid-action-code") {
        setError("Liên kết không hợp lệ.");
      } else {
        setError("Đã xảy ra lỗi: " + err.message);
      }
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }} // Đảm bảo hero.jpg nằm trong thư mục public
    >
      <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Đặt lại mật khẩu
        </h2>
        <div className="relative mb-6">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <Button
          onClick={handleResetPassword}
          className="w-full"
          gradientDuoTone="purpleToPink"
          disabled={isLoading}
        >
          {isLoading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
        </Button>
        {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Quay lại{" "}
            <span
              onClick={() => navigate("/sign-in")}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Đăng nhập
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
