import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
export default function DashReport() {
  const [reports, setReports] = useState([]); // Danh sách báo cáo
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [actionType, setActionType] = useState(""); // Loại hành động (removePost hoặc keepPost)
  const [reportIdToResolve, setReportIdToResolve] = useState(""); // Lưu ID báo cáo cần xử lý
  const [postIdToDelete, setPostIdToDelete] = useState(""); // Lưu ID bài viết cần xóa

  // Lấy danh sách báo cáo từ API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/report/get");
        const data = await res.json();
        if (res.ok) {
          setReports(data);
        } else {
          console.error("Lỗi khi lấy danh sách báo cáo:", data.message);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách báo cáo:", err.message);
      }
    };

    fetchReports();
  }, []);

  // Hiển thị modal xác nhận
  const showResolveModal = (reportId, postId, action) => {
    setReportIdToResolve(reportId);
    setPostIdToDelete(postId);
    setActionType(action);
    setShowModal(true);
  };

  // Xử lý báo cáo (gỡ bài hoặc hủy báo cáo)
  const handleResolveReport = async () => {
    setShowModal(false);

    try {
      const res = await fetch(`/api/report/resolve/${reportIdToResolve}/${postIdToDelete}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType }), // Hành động (removePost hoặc keepPost)
      });

      if (res.ok) {
        setReports((prev) =>
          prev.filter((report) => report._id !== reportIdToResolve)
        ); // Cập nhật danh sách báo cáo
        toast.success("Báo cáo đã được xử lý thành công!")
      } else {
        const data = await res.json();
        console.error("Lỗi khi xử lý báo cáo:", data.message);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý báo cáo:", err.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      {reports.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Bài viết</Table.HeadCell>
              <Table.HeadCell>Người dùng</Table.HeadCell>
              <Table.HeadCell>Lý do</Table.HeadCell>
              <Table.HeadCell>Hành động</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {reports.map((report) => (
                <Table.Row key={report._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{report.postId?.title || "Bài viết đã bị xóa"}</Table.Cell>
                  <Table.Cell>{report.userId?.username || "Ẩn danh"}</Table.Cell>
                  <Table.Cell>{report.reason}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        color="failure"
                        onClick={() => showResolveModal(report._id, report.postId?._id, "removePost")}
                        disabled={!report.postId} // Vô hiệu hóa nếu bài viết đã bị xóa
                      >
                        Gỡ bài
                      </Button>
                      <Button
                        color="gray"
                        onClick={() => showResolveModal(report._id, report.postId?._id, "keepPost")}
                      >
                        Hủy
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p className="text-center text-gray-500">Hiện tại không có báo cáo nào!</p>
      )}

      {/* Modal Xác Nhận */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              {actionType === "removePost"
                ? "Bạn có chắc chắn muốn gỡ bài viết này?"
                : "Bạn có chắc chắn muốn hủy báo cáo này?"}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleResolveReport}>
                {actionType === "removePost" ? "Vâng, gỡ bài" : "Vâng, hủy báo cáo"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Không, hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
