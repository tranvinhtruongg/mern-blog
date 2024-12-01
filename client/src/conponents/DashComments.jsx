import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx'; // Import the XLSX library for Excel export

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
      const res = await fetch(`/api/comment/deletecomment/${commentIdToDelete}`, {
        method: 'DELETE', // Sử dụng phương thức DELETE để xóa bình luận
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Export function for comments
  const handleExportExcel = () => {
    const exportData = comments.map(comment => ({
      'Date Updated': new Date(comment.updatedAt).toLocaleDateString(),
      'Comment Content': comment.content.length > 100 ? `${comment.content.slice(0, 100)}...` : comment.content,
      'Number of Likes': comment.numberOfLikes,
      'Post ID': comment.postId,
      'User ID': comment.userId,
    }));

    // Create a workbook and append the data
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Comments');

    // Export to Excel file
    XLSX.writeFile(wb, 'Comments.xlsx');
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          {/* Button to export to Excel */}
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Comment Management</h1>
            <Button outline gradientDuoTone='greenToBlue' onClick={handleExportExcel}>
              Export to Excel
            </Button>
          </div>

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
                  <Table.Cell className="truncate">
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
                    <span onClick={() => {
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

          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </>
      ) : (
        <p>Không có bình luận nào!</p>
      )}
      
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
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
