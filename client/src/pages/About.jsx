// src/components/About.jsx
import { FaUsers, FaLightbulb, FaLaptopCode, FaHeart, FaInfoCircle } from "react-icons/fa";
import CallToAction from '../conponents/CallToAction'; // Sửa đường dẫn đúng
import { motion } from "framer-motion";

export default function About() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }} // Đảm bảo hero.jpg nằm trong thư mục public
    >
      <motion.div
        className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-4xl overflow-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Tiêu đề chính */}
        <motion.h1
          className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Về Chúng Tôi
        </motion.h1>
        
        {/* Đoạn giới thiệu */}
        <motion.p
          className="text-lg text-gray-600 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Chào mừng bạn đến với blog của chúng tôi! Tại đây, chúng tôi chia sẻ kiến thức, kinh nghiệm và những điều mới mẻ trong lĩnh vực công nghệ và phát triển cá nhân.
        </motion.p>

        {/* Giới Thiệu Chung */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaLightbulb className="mr-2" /> Sứ Mệnh
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Sứ mệnh của chúng tôi là cung cấp kiến thức chất lượng và hỗ trợ cộng đồng học hỏi, phát triển kỹ năng trong môi trường công nghệ ngày càng phát triển nhanh chóng.
          </p>
        </motion.div>

        {/* Đội Ngũ */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaUsers className="mr-2" /> Đội Ngũ Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thành Viên 1 */}
            <motion.div
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/avt.jpg" // Đảm bảo hình ảnh nằm trong thư mục public
                alt="Trần Vĩnh Trường"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Trần Vĩnh Trường</h3>
              <p className="text-gray-600 dark:text-gray-300">Lập Trình Viên</p>
            </motion.div>
            
            {/* Thành Viên 2 */}
            <motion.div
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/meo2.jpg" // Đảm bảo hình ảnh nằm trong thư mục public
                alt="Trần Thị Hoa"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Trần Thị Hoa</h3>
              <p className="text-gray-600 dark:text-gray-300">Chuyên Gia Nội Dung</p>
            </motion.div>
            
            {/* Thành Viên 3 */}
            <motion.div
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/meo.jpg" // Đảm bảo hình ảnh nằm trong thư mục public
                alt="Lê Văn Quyết"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Lê Văn Quyết</h3>
              <p className="text-gray-600 dark:text-gray-300">Quản Trị Viên</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Giá Trị Cốt Lõi */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-white mb-4">
            <FaHeart className="mr-2" /> Giá Trị Cốt Lõi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Giá Trị 1 */}
            <motion.div
              className="flex items-start bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
              whileHover={{ backgroundColor: "#e2e8f0" }}
            >
              <FaLaptopCode className="text-blue-500 text-3xl mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Chất Lượng Nội Dung</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Chúng tôi cam kết cung cấp những bài viết chất lượng, cập nhật và hữu ích, giúp bạn nâng cao kỹ năng và kiến thức.
                </p>
              </div>
            </motion.div>
            
            {/* Giá Trị 2 */}
            <motion.div
              className="flex items-start bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
              whileHover={{ backgroundColor: "#e2e8f0" }}
            >
              <FaLaptopCode className="text-blue-500 text-3xl mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Cộng Đồng Hợp Tác</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Xây dựng một cộng đồng nơi mọi người có thể chia sẻ, học hỏi và hỗ trợ lẫn nhau trong hành trình phát triển cá nhân và nghề nghiệp.
                </p>
              </div>
            </motion.div>
          </div>
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
            <FaInfoCircle className="mr-2" /> Liên Hệ Với Chúng Tôi
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Bạn có câu hỏi hoặc đề xuất nào? Hãy liên hệ với chúng tôi qua email: <a href="mailto:contact@yourblog.com" className="text-blue-500 underline">contact@yourblog.com</a>.
          </p>
        </motion.div>

        {/* Call to Action */}
        <CallToAction />
      </motion.div>
    </div>
  );
}
