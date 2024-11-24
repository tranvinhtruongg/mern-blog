import { useEffect, useState } from 'react';
import { Button, Table } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function DashApprovePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts');
        const data = await res.json();
        if (res.ok) {
          setPendingPosts(data.posts.filter((post) => !post.isApproved)); // Lọc bài chưa duyệt
        } else {
          console.error('Failed to fetch posts:', data.message);
        }
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPendingPosts();
    }
  }, [currentUser]);

  const handleApprove = async (postId) => {
    try {
      const res = await fetch(`/api/post/approve/${postId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (res.ok) {
        setPendingPosts((prev) => prev.filter((post) => post._id !== postId)); // Xóa bài đã duyệt
      }
    } catch (err) {
      console.error('Error approving post:', err.message);
    }
  };

  const handleReject = async (postId) => {
    try {
      const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (res.ok) {
        setPendingPosts((prev) => prev.filter((post) => post._id !== postId)); // Xóa bài bị từ chối
      }
    } catch (err) {
      console.error('Error rejecting post:', err.message);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {pendingPosts.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Tiêu đề</Table.HeadCell>
            <Table.HeadCell>Danh mục</Table.HeadCell>
            <Table.HeadCell>Hành động</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {pendingPosts.map((post) => (
              <Table.Row key={post._id} className="bg-white dark:bg-gray-800">
                <Table.Cell>{post.title}</Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell className="flex gap-4">
                  <Button
                    color="success"
                    onClick={() => handleApprove(post._id)}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    color="failure"
                    onClick={() => handleReject(post._id)}
                  >
                    Từ chối
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-center text-gray-500">Không có bài viết nào cần duyệt.</p>
      )}
    </div>
  );
}
