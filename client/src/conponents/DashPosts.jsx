import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import XLSX library for Excel export

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user); // Lấy thông tin user từ Redux
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true); // Hiển thị nút "Xem thêm"
  const [expanded, setExpanded] = useState(false); // Quản lý trạng thái mở rộng/thu gọn
  const [showModal, setShowModal] = useState(false); // Quản lý modal xóa bài viết
  const [postIdToDelete, setPostIdToDelete] = useState(''); // ID bài viết cần xóa
  const initialPostCount = 9; // Số bài viết ban đầu

  // Lấy bài viết từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = currentUser.isAdmin
          ? `/api/post/getposts` // Admin: Tải tất cả bài viết
          : `/api/post/getposts?userId=${currentUser._id}`; // User: Tải bài viết của họ

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok && data.posts) {
          setUserPosts(data.posts);

          // Nếu số bài viết ít hơn `initialPostCount`, ẩn nút "Xem thêm"
          if (data.posts.length < initialPostCount) {
            setShowMore(false);
          }
        } else {
          console.error('Failed to fetch posts:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  // Xử lý "Xem thêm" hoặc thu gọn bài viết
  const handleShowMore = async () => {
    if (!expanded) {
      const startIndex = userPosts.length;

      try {
        const url = currentUser.isAdmin
          ? `/api/post/getposts?startIndex=${startIndex}` // Admin: Lấy bài tiếp theo
          : `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`; // User: Lấy bài tiếp theo của họ

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          setUserPosts((prev) => [...prev, ...data.posts]);

          if (data.posts.length < initialPostCount) {
            setShowMore(false); // Không còn bài viết nào để tải thêm
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      // Thu gọn bài viết
      setUserPosts((prev) => prev.slice(0, initialPostCount));
      setShowMore(true); // Cho phép mở lại "Xem thêm"
    }
    setExpanded(!expanded);
  };

  // Xử lý xóa bài viết
  const handleDeletePost = async () => {
    setShowModal(false); // Đóng modal sau khi xác nhận

    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        // Cập nhật danh sách bài viết
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Export function for posts
  const handleExportExcel = () => {
    const exportData = userPosts.map(post => ({
      'Ngày chỉnh sửa': new Date(post.updatedAt).toLocaleDateString(),
      'Tiêu đề': post.title,
      'Danh mục': post.category,
      'Trạng thái': post.isApproved ? 'Chấp nhận' : 'Từ chối',
    }));

    // Create a workbook and append the data
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Posts');

    // Export to Excel file
    XLSX.writeFile(wb, 'Posts.xlsx');
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      {userPosts.length > 0 ? (
        <>
          {/* Button to export to Excel */}
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Bài Viết Quản Lý</h1>
            <Button outline gradientDuoTone="greenToBlue" onClick={handleExportExcel}>
              Xuất ra Excel
            </Button>
          </div>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Ngày chỉnh sửa</Table.HeadCell>
              <Table.HeadCell>Ảnh bài viết</Table.HeadCell>
              <Table.HeadCell>Tiêu đề</Table.HeadCell>
              <Table.HeadCell>Danh mục</Table.HeadCell>
              <Table.HeadCell>Trạng thái</Table.HeadCell>
              {currentUser.isAdmin && <Table.HeadCell>Xóa</Table.HeadCell>}
              {currentUser.isAdmin && <Table.HeadCell>Sửa</Table.HeadCell>}
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-10 object-cover" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    {post.isApproved ? (
                      <span className="text-green-500 font-semibold">Chấp nhận</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Từ chối</span>
                    )}
                  </Table.Cell>
                  {currentUser.isAdmin && (
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Xóa
                      </span>
                    </Table.Cell>
                  )}
                  {currentUser.isAdmin && (
                    <Table.Cell>
                      <Link className="text-teal-500 hover:underline" to={`/update-post/${post._id}`}>
                        Sửa
                      </Link>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <button onClick={handleShowMore} className="w-full text-teal-500 text-sm py-7">
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </>
      ) : (
        <p className="text-center text-gray-500">
          {currentUser.isAdmin ? 'Không có bài viết nào!' : 'Bạn chưa có bài viết nào!'}
        </p>
      )}

      {/* Modal Xóa Bài Viết */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Bạn có chắc chắn muốn xóa bài viết này?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Vâng, tôi muốn xóa.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Không, hủy.
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
