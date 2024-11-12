import { FaStar, FaBook, FaCommentDots } from 'react-icons/fa';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7 '>
            <FaStar className='mr-2' />
            Về TVT Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Chào mừng đến với TVT Blog! Blog này được tạo bởi TVT Blog
              như một dự án cá nhân để chia sẻ mọi thứ kinh nghiệm và học tập. TVT là một nơi tìm hiểu phát triển đam mê, người yêu thích viết về
              công nghệ, lập trình và mọi thứ liên quan.
            </p>
            <p>
              <FaBook className='mr-2 ' />
              Trên blog này, bạn sẽ tìm thấy các bài viết và hướng dẫn hàng tuần về các chủ đề
              như đời sống, tất cả mọi thứ xung quanh.
              TVT luôn học hỏi và khám phá những thứ mới mẻ,
              vì vậy hãy thường xuyên kiểm tra để có nội dung mới!
            </p>
            <p>
              <FaCommentDots className='mr-2' />
              Chúng tôi khuyến khích bạn để lại bình luận trên các bài viết của chúng tôi và tương tác với
              các độc giả khác. Bạn có thể thích bình luận của người khác và trả lời
              chúng. Chúng tôi tin rằng một cộng đồng học tập có thể giúp
              nhau phát triển và cải thiện.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
