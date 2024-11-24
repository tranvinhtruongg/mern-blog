import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { approvePost, create, deletepost, getposts,rejectPost, updatepost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create',verifyToken,create)
router.get('/getposts',getposts)
router.delete('/deletepost/:postId/:userId',verifyToken,deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.put('/approve/:postId', verifyToken, approvePost); // Admin duyệt bài
router.put('/reject/:postId', verifyToken, rejectPost);  // Admin từ chối bài

export default router;