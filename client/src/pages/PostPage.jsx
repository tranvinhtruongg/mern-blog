// import { Button, Spinner } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import CallToAction from '../conponents/CallToAction';
// import CommentSection from '../conponents/CommentSection';
// import PostCard from '../conponents/PostCard';
// export default function PostPage() {
//   const { postSlug } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [post, setPost] = useState(null);
//   const [recentPosts, setRecentPosts] = useState(null);
//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
//         const data = await res.json();
//         if (!res.ok) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         if (res.ok) {
//           setPost(data.posts[0]);
//           setLoading(false);
//           setError(false);
//         }
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [postSlug]);

//   useEffect(() => {
//     try {
//       const fetchRecentPosts = async () => {
//         const res = await fetch(`/api/post/getposts?limit=3`);
//         const data = await res.json();
//         if (res.ok) {
//           setRecentPosts(data.posts.filter((post) => post.isApproved));
//         }
//       };
//       fetchRecentPosts();
//     } catch (error) {
//       console.log(error.message);
//     }
//   }, []);

//   if (loading)
//     return (
//       <div className='flex justify-center items-center min-h-screen'>
//         <Spinner size='xl' />
//       </div>
//     );
//   return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
//     <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
//     <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
//     <Button color='gray' pill size='xs'>{post && post.category}</Button>
//     </Link>
//     <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
//     <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
//         <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
//         <span className='italic'>{post && (post.content.length /1000).toFixed(0)} phút đọc</span>
//     </div>
//     <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>
//     </div>
//     <div className="max-w-4xl mx-auto w-full">
//       <CallToAction/>
//     </div>
//     <CommentSection postId={post._id}/>

//     <div className='flex flex-col justify-center items-center mb-5'>
//       <h1 className='text-xl mt-5'>Bài viết gần đây</h1>
//       <div className='flex flex-wrap gap-5 mt-5 justify-center'>
//         {recentPosts &&
//           recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
//       </div>
//     </div>
    
//   </main>;
// }import { Button, Modal, Select, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AiOutlineExclamationCircle } from 'react-icons/ai'; // Import icon từ react-icons
import { Button, Modal, Select, Spinner } from 'flowbite-react';
import { toast } from 'react-toastify';
import CallToAction from '../conponents/CallToAction';
import CommentSection from '../conponents/CommentSection';
import PostCard from '../conponents/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const reasons = [
    'Bắt nạt hoặc gây rối',
    'Tự tử, tự gây thương tích hoặc chứng rối loạn ăn uống',
    'Bạo lực, thù ghét hoặc bóc lột',
    'Lừa đảo gian lận hoặc mạo danh',
    'Khác',
  ];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts.filter((post) => post.isApproved));
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  const handleReportSubmit = async () => {
    if (!reportReason) return;

    try {
      const res = await fetch('/api/report/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id, reason: reportReason }),
      });
      if (res.ok) {
        setReportSuccess(true);
        setShowReportModal(false);
        setReportReason('');
        toast.success('Cảm ơn bạn đã gửi báo cáo!');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <div className="relative">
        {/* Nút báo cáo */}
        <button
          className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
          onClick={() => setShowReportModal(true)}
        >
          <AiOutlineExclamationCircle className="h-6 w-6" />
        </button>
      </div>
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{post && (post.content.length / 1000).toFixed(0)} phút đọc</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Bài viết gần đây</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
          {recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>

      {/* Modal báo cáo */}
      <Modal show={showReportModal} onClose={() => setShowReportModal(false)}>
        <Modal.Header>Báo cáo bài viết</Modal.Header>
        <Modal.Body>
          {reportSuccess ? (
            <div className="text-green-500">Cảm ơn bạn đã gửi báo cáo!</div>
          ) : (
            <>
              <Select
                id="reportReason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="" disabled>
                  Chọn lý do báo cáo
                </option>
                {reasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </Select>
              <Button onClick={handleReportSubmit} className="mt-4">
                Gửi báo cáo
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </main>
  );
}
