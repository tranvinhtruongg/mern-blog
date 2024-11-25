import express from "express";
import { createReport, getReports, deleteReport, resolveReport } from "../controllers/report.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createReport); // Tạo báo cáo
router.get("/get", verifyToken, getReports); // Lấy danh sách báo cáo (admin)
router.delete("/delete/:id", verifyToken, deleteReport); // Xóa báo cáo
router.post("/resolve/:reportId/:postId", verifyToken,resolveReport); // Xử lý báo cáo

export default router;
