import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx'; // Import the XLSX library for Excel export

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true); // Quản lý hiển thị nút "Xem thêm"
  const [expanded, setExpanded] = useState(false); // Quản lý trạng thái mở rộng/thu gọn
  const [showModal, setShowModal] = useState(false); // Quản lý hiển thị modal
  const [userIdToDelete, setUserIdToDelete] = useState(''); // Lưu id bài viết cần xóa
  const initialUserCount = 9; // Số bài viết ban đầu
  const [lastMonthUserCount, setLastMonthUserCount] = useState(0); // Số người dùng tạo tài khoản trong tháng vừa qua

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

          // Tính số lượng người dùng tạo tài khoản trong tháng vừa qua
          const now = new Date();
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const filteredUsers = data.users.filter(user => new Date(user.createdAt) > lastMonth);
          setLastMonthUserCount(filteredUsers.length);
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
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE', // Sử dụng phương thức DELETE để xóa người dùng
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Export function
  const handleExportExcel = () => {
    // Prepare data for export
    const exportData = users.map(user => ({
      'Date Created': new Date(user.createdAt).toLocaleDateString(),
      'Username': user.username,
      'Email': user.email,
      'Admin': user.isAdmin ? 'Yes' : 'No',
    }));
  
    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(exportData);
  
    // Format headers
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };
  
    // Apply header styles to the first row (headers)
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = ws[XLSX.utils.encode_cell({ r: range.s.r, c: col })];
      if (cell) {
        cell.s = headerStyle; // Apply style to header cells
      }
    }
  
    // Format date columns (optional)
    ws['!cols'] = [
      { width: 20 }, // 'Date Created' column width
      { width: 25 }, // 'Username' column width
      { width: 35 }, // 'Email' column width
      { width: 10 }, // 'Admin' column width
    ];
  
    // Add borders to data cells
    const borderStyle = {
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };
  
    // Loop through the data rows and apply border style
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell) {
          cell.s = borderStyle; // Apply border style to data cells
        }
      }
    }
  
    // Create the workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
  
    // Export the workbook as an Excel file
    XLSX.writeFile(wb, 'Users.xlsx');
  };

  return (
    <div className='p-3 table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          {/* Button to export to Excel */}
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Quản lý người dùng</h1>
            <Button outline gradientDuoTone='greenToBlue' onClick={handleExportExcel}>
              Export to Excel
            </Button>
          </div>

          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
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
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? (<FaCheck className="text-green-500"/>) : (<FaTimes className="text-red-500"/>)}</Table.Cell>
                  <Table.Cell>
                    <span onClick={() => {
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

          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            {expanded ? 'Thu gọn' : 'Xem thêm'}
          </button>

        </>
      ) : (
        <p>Không có người dùng nào!</p>
      )}
      
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
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
