// src/components/Rules.jsx
import { FaShieldAlt, FaUserShield, FaBan, FaInfoCircle } from "react-icons/fa";
import CallToAction from '../conponents/CallToAction'; // Đảm bảo đường dẫn đúng
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }} // Đảm bảo hero.jpg nằm trong thư mục public
    >
      <motion.div
        className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Quy Định Chung & Nội Quy
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Chào mừng bạn đến với blog của chúng tôi. Vui lòng đọc kỹ các quy định dưới đây để đảm bảo một môi trường thân thiện và chuyên nghiệp cho tất cả mọi người.
        </motion.p>
        
        {/* Chính Sách Nội Dung */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaShieldAlt className="mr-2" /> 1. Chính Sách Nội Dung
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Chúng tôi khuyến khích mọi người chia sẻ kiến thức, kinh nghiệm và ý tưởng. Tuy nhiên, các nội dung sau đây bị cấm:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>Thông tin vi phạm bản quyền.</li>
            <li>Nội dung kích động bạo lực hoặc thù địch.</li>
            <li>Thông tin cá nhân mà không được sự đồng ý của chủ sở hữu.</li>
            <li>Nội dung phản cảm hoặc không phù hợp với đạo đức xã hội.</li>
          </ul>
        </motion.div>

        {/* Trách Nhiệm Của Người Dùng */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaUserShield className="mr-2" /> 2. Trách Nhiệm Của Người Dùng
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>Người dùng phải tôn trọng quyền sở hữu trí tuệ của người khác.</li>
            <li>Không sử dụng blog để quảng cáo sản phẩm hoặc dịch vụ mà không được phép.</li>
            <li>Tuân thủ các quy định pháp luật liên quan đến việc sử dụng internet và bảo mật thông tin.</li>
          </ul>
        </motion.div>

        {/* Các Hành Vi Cấm Kỵ */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaBan className="mr-2" /> 3. Các Hành Vi Cấm Kỵ
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Để đảm bảo một môi trường an toàn và tích cực, chúng tôi cấm các hành vi sau:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>Spam hoặc gửi quá nhiều nội dung không liên quan.</li>
            <li>Gây rối hoặc quấy nhiễu người dùng khác.</li>
            <li>Dùng ngôn ngữ thô tục hoặc xúc phạm.</li>
          </ul>
        </motion.div>

        {/* Chính Sách Bảo Mật */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaInfoCircle className="mr-2" /> 4. Chính Sách Bảo Mật
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Vui lòng xem chi tiết trong phần <a href="/privacy-policy" className="text-blue-500 underline">Chính Sách Bảo Mật</a> của chúng tôi.
          </p>
        </motion.div>

        {/* Thay Đổi Quy Định */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaInfoCircle className="mr-2" /> 5. Thay Đổi Quy Định
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Chúng tôi có quyền thay đổi hoặc cập nhật các quy định này bất kỳ lúc nào mà không cần thông báo trước. Vui lòng thường xuyên kiểm tra trang này để cập nhật các thay đổi mới nhất.
          </p>
        </motion.div>

        {/* Liên Hệ */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaInfoCircle className="mr-2" /> 6. Liên Hệ
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về các quy định này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@yourblog.com" className="text-blue-500 underline">support@yourblog.com</a>.
          </p>
        </motion.div>

        {/* Call to Action */}
        <CallToAction />
      </motion.div>
    </div>
  );
}
