import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { Button } from "flowbite-react"; // Import Button từ flowbite-react

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = async () => {
    const auth = getAuth();

    // Kiểm tra định dạng email trước khi gửi yêu cầu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Vui lòng nhập một email hợp lệ.");
      setMessage("");
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!");
      setError("");
    } catch (err) {
      console.error("Lỗi chi tiết:", err.code, err.message);

      if (err.code === "auth/user-not-found") {
        setError("Không tìm thấy tài khoản với email này.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email không hợp lệ.");
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
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Quên Mật Khẩu
        </h2>
        <div className="relative mb-6">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <Button
          onClick={handleResetPassword}
          className="w-full"
          gradientDuoTone="purpleToPink"
          disabled={isLoading}
        >
          {isLoading ? "Đang gửi..." : "Gửi yêu cầu đặt lại mật khẩu"}
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
