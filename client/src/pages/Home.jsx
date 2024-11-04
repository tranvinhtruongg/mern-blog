import { Link } from 'react-router-dom';
import CallToAction from '../conponents/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../conponents/PostCard';
import FloatingWidget from '../conponents/FloatingWidget';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const banners = [
    { id: 1, image: 'banner1.png' },
    { id: 2, image: 'banner2.png' },
    { id: 3, image: 'banner3.png' },
    { id: 4, image: 'banner4.png' },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

// Custom Arrow Components with SVG
const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
};


  // Cấu hình cho slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,   // Sử dụng mũi tên custom
    prevArrow: <SamplePrevArrow />    // Sử dụng mũi tên custom
  };

  return (
    <div>
      {/* Slider quảng cáo */}
      <div className='max-w-6xl mx-auto p-3'>
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner.id} className='relative'>
              <img
                src={banner.image}
                alt={banner.title}
                className='w-full h-[400px] object-cover rounded-lg'
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Nội dung chính */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>chào mừng bạn đến TVT Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Ở đây bạn sẽ tìm thấy nhiều bài viết về công nghệ giải trí và nhiều lĩnh vực khác!
        </p>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Bài viết gần đây</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              Tất cả bài viết
            </Link>
          </div>
        )}
      </div>
      <FloatingWidget/>
    </div>
  );
}