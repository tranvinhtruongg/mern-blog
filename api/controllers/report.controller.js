import Report from "../models/report.model.js";
import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
export const createReport = async (req, res, next) => {
  const { postId, reason } = req.body;

  if (!postId || !reason) {
    return next(errorHandler(400, "Vui lòng cung cấp đầy đủ thông tin báo cáo"));
  }

  try {
    const newReport = new Report({
      postId,
      userId: req.user.id, // Lấy user từ token
      reason,
    });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    next(err);
  }
};

// export const getReports = async (req, res, next) => {
//   try {
//     const reports = await Report.find()
//       .populate("postId", "title")
//       .populate("userId", "username");
//     res.status(200).json(reports);
//   } catch (err) {
//     next(err);
//   }
// };
export const getReports = async (req, res, next) => {
  try {
    // Lấy báo cáo cùng bài viết liên quan
    const reports = await Report.find()
      .populate("postId", "title")
      .populate("userId", "username");

    // Loại bỏ các báo cáo mà bài viết đã bị xóa
    const filteredReports = reports.filter((report) => report.postId !== null);

    res.status(200).json(filteredReports);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách báo cáo:", err.message);
    next(err);
  }
};


export const deleteReport = async (req, res, next) => {
  try {
    await Report.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Xóa báo cáo thành công" });
  } catch (err) {
    next(err);
  }
};

// export const resolveReport = async (req, res, next) => {
//   try {
//     const { action } = req.body;

//     if (action === "removePost") {
//       // Xóa bài viết khỏi cơ sở dữ liệu
//       const deletedPost = await Post.findByIdAndDelete(req.params.postId);
//       if (!deletedPost) {
//         return next(errorHandler(404, "Bài viết không tồn tại"));
//       }
//     }

//     // Xóa báo cáo sau khi xử lý
//     await Report.findByIdAndDelete(req.params.reportId);
//     res.status(200).json({ message: "Bài viết và báo cáo đã được xử lý thành công" });
//   } catch (err) {
//     console.error("Lỗi khi xử lý báo cáo:", err.message);
//     next(err);
//   }
// };

export const resolveReport = async (req, res, next) => {
  try {
    const { action } = req.body;

    if (action === "removePost") {
      // Xóa bài viết
      const deletedPost = await Post.findByIdAndDelete(req.params.postId);
      if (!deletedPost) {
        return next(errorHandler(404, "Bài viết không tồn tại"));
      }

      // Xóa tất cả báo cáo liên quan đến bài viết
      await Report.deleteMany({ postId: req.params.postId });
    } else {
      // Nếu không xóa bài viết, chỉ xóa báo cáo
      await Report.findByIdAndDelete(req.params.reportId);
    }

    res.status(200).json({ message: "Xử lý báo cáo thành công" });
  } catch (err) {
    console.error("Lỗi khi xử lý báo cáo:", err.message);
    next(err);
  }
};
