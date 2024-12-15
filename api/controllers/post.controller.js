import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async(req, res,next) => {
    
    
    // if(!req.user.isAdmin){
    //     return next(errorHandler(403, 'Bạn không có quyền thực hiện chức năng này'))
    // }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Vui lòng nhập đủ thông tin'))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post ({
        ...req.body,slug, userId: req.user.id
    })
    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    }
    catch(err){
        next(err)
    }
}
export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        
        console.log("Start fetching posts with params:", req.query);

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        }).populate('userId', 'username') // Lấy thông tin `username` từ User
        .sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);


        const totalPost = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({ posts, totalPost, lastMonthPosts });
    } catch (err) {
        console.error("Error fetching posts:", err); // Log lỗi
        next(err); // Chuyển lỗi cho middleware xử lý
    }
};

export const deletepost = async(req, res,next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'Bạn không có quyền thực hiện chức năng này'))
    }
    try{
        await Post.findOneAndDelete(req.params.postId);
        res.status(200).json({message: 'Xóa bài viết thành công'})
    }
    catch(err){
        next(err)
    }
}

export const updatepost = async(req, res, next) => {
    // Kiểm tra xem người dùng có quyền là admin hoặc là chủ sở hữu của bài viết không
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        // Nếu không có quyền, trả về lỗi 403 - Forbidden
        return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    try {
        // Tìm bài viết theo postId từ URL và cập nhật các trường title, content, category, image
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.postId,  // Lấy postId từ tham số URL
          {
            $set: {
              title: req.body.title,      // Lấy title từ phần body của request
              content: req.body.content,  // Lấy content từ body
              category: req.body.category, // Lấy category từ body
              image: req.body.image,      // Lấy image từ body
            },
          },
          { new: true } // Tùy chọn này trả về document đã cập nhật thay vì document trước khi cập nhật
        );
        // Trả về response thành công kèm với bài viết đã được cập nhật
        res.status(200).json(updatedPost);
    } catch (error) {
        // Nếu xảy ra lỗi, chuyển sang middleware xử lý lỗi
        next(error);
    }
}

export const approvePost = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorHandler(403, 'Bạn không có quyền thực hiện chức năng này'));
        }
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            { isApproved: true },
            { new: true }
        );
        if (!post) {
            return next(errorHandler(404, 'Bài viết không tồn tại'));
        }
        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
};

export const rejectPost = async (req, res, next) => {
    try {
      if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Bạn không có quyền thực hiện chức năng này'));
      }
  
      const post = await Post.findByIdAndDelete(req.params.postId); // Xóa bài viết
      if (!post) {
        return next(errorHandler(404, 'Bài viết không tồn tại'));
      }
  
      res.status(200).json({ message: 'Bài viết đã bị từ chối và xóa khỏi hệ thống.' });
    } catch (err) {
      next(err);
    }
  };
  