import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true); // Quản lý hiển thị nút "Xem thêm"
  const [expanded, setExpanded] = useState(false); // Quản lý trạng thái mở rộng/thu gọn
  const [showModal, setShowModal] = useState(false); // Quản lý hiển thị modal
  const [commentIdToDelete, setCommentIdToDelete] = useState(''); // Lưu id bài viết cần xóa
  const initialUserCount = 9; // Số bài viết ban đầu

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          // Nếu số lượng bài viết ít hơn 9, không hiển thị nút "Xem thêm"
          if (data.comments.length < initialUserCount) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
        fetchComments();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    if (!expanded) {
      // Mở rộng danh sách bài viết
      const startIndex = comments.length;
      try {
        const res = await fetch(
          `/api/comment/getcomments?startIndex=${startIndex}`
        );
        const data = await res.json();
        if (res.ok) {
          setComments((prev) => [...prev, ...data.comments]);
          // Nếu số bài viết nhận được ít hơn 9, không tải thêm được nữa
          if (data.comments.length < initialUserCount) {
            setShowMore(false); // Không còn bài để tải thêm
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      // Thu gọn danh sách bài viết về trạng thái ban đầu
      setComments((prev) => prev.slice(0, initialUserCount));
      setShowMore(true); // Cho phép hiện lại nút "Xem thêm" sau khi thu gọn
    }
    setExpanded(!expanded); // Đổi trạng thái mở rộng/thu gọn
  };

  const handleDeleteComments = async () => {
    setShowModal(false);
    try {
      // Gửi yêu cầu DELETE đến endpoint backend với id của người dùng cần xóa
      const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
        method: 'DELETE', // Sử dụng phương thức DELETE để xóa người dùng
      });
  
      // Chuyển đổi phản hồi từ server sang định dạng JSON
      const data = await res.json();
  
      // Kiểm tra nếu phản hồi từ server là thành công (HTTP status 200-299)
      if (res.ok) {
        // Cập nhật lại danh sách người dùng trong React state
        // Bằng cách loại bỏ người dùng có id trùng với commentsIdToDelete
        setComments((prev) => prev.filter((comments) => comments._id !== commentIdToDelete));
  
        // Đóng modal sau khi quá trình xóa hoàn tất
        setShowModal(false);
      } else {
        // Nếu server phản hồi không thành công, in thông báo lỗi từ phản hồi ra console
        console.log(data.message);
      }
    } catch (error) {
      // Nếu có lỗi xảy ra trong quá trình thực hiện yêu cầu (ví dụ, lỗi mạng)
      // In thông báo lỗi ra console
      console.log(error.message);
    }
  }
  

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {comments.map((comment) => (
                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>
                  <Table.Cell>
                      {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>
                    {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true)
                      setCommentIdToDelete(comment._id)
                    }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                      Delete
                    </span>
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
        <p>Không có bình luận nào!</p>
      )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Bạn có chắc chắn muốn xóa bình luận này?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComments}>
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
