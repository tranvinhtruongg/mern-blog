import { Link } from 'react-router-dom';
import CallToAction from '../conponents/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../conponents/PostCard';
import FloatingWidget from '../conponents/FloatingWidget';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';

export default function Home() {
  const [posts, setPosts] = useState([]);

  const banners = [
    { id: 1, image: 'banner1.png' },
    { id: 2, image: 'banner2.png' },
    { id: 3, image: 'banner3.png' },
    { id: 4, image: 'banner4.png' },
  ];

  const categories = [
    { id: 'maytinh', name: 'Máy tính' },
    { id: 'phanmem', name: 'Phần mềm & Games' },
    { id: 'vuichoigiaitri', name: 'Khu vui chơi giải trí' },
    { id: 'thuongmai', name: 'Khu thương mại' },
    { id: 'congnghe', name: 'Sản phẩm công nghệ' },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts'); // Chỉnh sửa endpoint nếu cần
        if (!res.ok) {
          console.error('Error fetching posts:', res.statusText);
          return;
        }
        const data = await res.json();
        if (data.posts) {
          setPosts(data.posts.filter((post) => post.isApproved));
        } else {
          console.error('No posts data returned from the API.');
        }
      } catch (err) {
        console.error('Fetch posts failed:', err.message);
      }
    };
    fetchPosts();
  }, []);

  // Nhóm bài viết theo danh mục
  const categorizedPosts = categories.map((category) => ({
    category,
    posts: posts.filter((post) => post.category === category.id),
  }));

  // Slider configuration
  const settings = {
    dots: true,
    infinite: true,
    speed: 700, // Tăng tốc độ chuyển đổi
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Tăng thời gian hiển thị mỗi slide
    fade: true, // Sử dụng hiệu ứng fade thay vì slide
    cssEase: 'linear',
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian animation
      once: true, // Chỉ chạy một lần khi cuộn vào
    });
  }, []);

  return (
    <div className="transition-colors duration-500">
      {/* Slider */}
      <div className='max-w-6xl mx-auto p-3'>
        <Slider {...settings}>
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              className='relative'
              data-aos="fade-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <img
                src={banner.image}
                alt={`Banner ${banner.id}`}
                className='w-full h-[400px] object-cover rounded-lg'
              />
            </motion.div>
          ))}
        </Slider>
      </div>

      {/* Main content */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <motion.h1
          className='text-3xl font-bold lg:text-6xl'
          data-aos="fade-up"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Chào mừng bạn đến TVT Blog
        </motion.h1>
        <motion.p
          className='text-gray-500 text-xs sm:text-sm'
          data-aos="fade-up"
          data-aos-delay="200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Ở đây bạn sẽ tìm thấy nhiều bài viết về công nghệ, giải trí và nhiều lĩnh vực khác!
        </motion.p>
      </div>

      {/* Call to Action */}
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      {/* Bài viết gần đây */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7' data-aos="fade-up">
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Bài viết gần đây</h2>
            <div className='flex flex-wrap gap-4'>
              {/* Only map through the first 6 posts */}
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:text-teal-700 hover:underline transition duration-300 text-center'
            >
              Tất cả bài viết
            </Link>
          </div>
        )}
      </div>

      {/* Danh mục bài viết */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {categorizedPosts.map(({ category, posts }) => (
          <div key={category.id} className='flex flex-col gap-6' data-aos="fade-up">
            <h2 className='text-2xl font-semibold text-center text-red-500'>{category.name}</h2>
            {posts.length > 0 ? (
              <div className='flex flex-col gap-2'>
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className='flex justify-between items-center bg-white dark:bg-gray-800 shadow rounded-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl'
                  >
                    <div>
                      <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                        {post.title}
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                         Ngày đăng: {new Date(post.createdAt).toLocaleDateString()} - {new Date(post.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Link
                      to={`/post/${post.slug}`}
                      className='text-teal-500 hover:text-teal-700 font-semibold text-sm transition-all duration-300'
                    >
                      Đọc ngay
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center'>Không có bài viết nào trong danh mục này.</p>
            )}
          </div>
        ))}
        <Link
          to={'/search'}
          className='text-lg text-teal-500 hover:text-teal-700 hover:underline transition duration-300 text-center'
        >
          Xem tất cả bài viết
        </Link>
      </div>

      {/* Floating Widget */}
      <FloatingWidget />
    </div>
  );
}