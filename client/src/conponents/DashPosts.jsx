import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true); // Quản lý hiển thị nút "Xem thêm"
  const [expanded, setExpanded] = useState(false); // Quản lý trạng thái mở rộng/thu gọn
  const [showModal, setShowModal] = useState(false); // Quản lý hiển thị modal
  const [postIdToDelete, setPostIdToDelete] = useState(''); // Lưu id bài viết cần xóa
  const initialPostCount = 9; // Số bài viết ban đầu

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          // Nếu số lượng bài viết ít hơn 9, không hiển thị nút "Xem thêm"
          if (data.posts.length < initialPostCount) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    if (!expanded) {
      // Mở rộng danh sách bài viết
      const startIndex = userPosts.length;
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts((prev) => [...prev, ...data.posts]);
          // Nếu số bài viết nhận được ít hơn 9, không tải thêm được nữa
          if (data.posts.length < initialPostCount) {
            setShowMore(false); // Không còn bài để tải thêm
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      // Thu gọn danh sách bài viết về trạng thái ban đầu
      setUserPosts((prev) => prev.slice(0, initialPostCount));
      setShowMore(true); // Cho phép hiện lại nút "Xem thêm" sau khi thu gọn
    }
    setExpanded(!expanded); // Đổi trạng thái mở rộng/thu gọn
  };

  const handleDeletePost = async () => {
    // Đóng modal sau khi người dùng nhấn xóa
    setShowModal(false);

    try {
        // Gửi yêu cầu xóa bài viết bằng phương thức DELETE đến API
        const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
            method: 'DELETE', // Sử dụng phương thức DELETE cho yêu cầu
        });

        // Chuyển đổi kết quả phản hồi từ server thành JSON
        const data = await res.json();

        // Nếu phản hồi không thành công, in thông báo lỗi ra console
        if (!res.ok) {
            console.log(data.message);
        } 
        // Nếu phản hồi thành công, cập nhật lại danh sách bài viết của người dùng
        else {
            setUserPosts((prev) =>
                // Lọc danh sách bài viết, loại bỏ bài viết vừa xóa
                prev.filter((post) => post._id !== postIdToDelete)
            );
        }
    } catch (error) {
        // In thông báo lỗi ra console nếu có lỗi xảy ra trong quá trình xóa
        console.log(error.message);
    }
};

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {userPosts.map((post) => (
                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true)
                      setPostIdToDelete(post._id)
                    }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {/* Luôn hiển thị nút dù đang ở chế độ mở rộng hay thu gọn */}
          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </>
      ) : (
        <p>Bạn chưa có bài viết nào!</p>
      )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Bạn có chắc chắn muốn xóa bài viết này?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Vâng, tôi muốn xóa.
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
        </Modal>
    </div>
  );
}
