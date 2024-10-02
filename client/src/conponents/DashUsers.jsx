import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true); // Quản lý hiển thị nút "Xem thêm"
  const [expanded, setExpanded] = useState(false); // Quản lý trạng thái mở rộng/thu gọn
  const [showModal, setShowModal] = useState(false); // Quản lý hiển thị modal
  const [userIdToDelete, setUserIdToDelete] = useState(''); // Lưu id bài viết cần xóa
  const initialUserCount = 9; // Số bài viết ban đầu

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          // Nếu số lượng bài viết ít hơn 9, không hiển thị nút "Xem thêm"
          if (data.users.length < initialUserCount) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
        fetchUser();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    if (!expanded) {
      // Mở rộng danh sách bài viết
      const startIndex = users.length;
      try {
        const res = await fetch(
          `/api/user/getusers?startIndex=${startIndex}`
        );
        const data = await res.json();
        if (res.ok) {
          setUsers((prev) => [...prev, ...data.users]);
          // Nếu số bài viết nhận được ít hơn 9, không tải thêm được nữa
          if (data.users.length < initialUserCount) {
            setShowMore(false); // Không còn bài để tải thêm
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      // Thu gọn danh sách bài viết về trạng thái ban đầu
      setUsers((prev) => prev.slice(0, initialUserCount));
      setShowMore(true); // Cho phép hiện lại nút "Xem thêm" sau khi thu gọn
    }
    setExpanded(!expanded); // Đổi trạng thái mở rộng/thu gọn
  };

  const handleDeleteUser = async () => {

  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users.map((user) => (
                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                      />
                  </Table.Cell>
                  <Table.Cell>
                      {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>)}</Table.Cell>
                  <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true)
                      setUserIdToDelete(user._id)
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
        <p>Không có người dùng nào!</p>
      )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Bạn có chắc chắn muốn xóa người dùng này?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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
