import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({ message: 'API đang hoạt động!' });
  
  // { message: 'API đang hoạt động!' }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'Bạn không được phép cập nhật người dùng này'));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Mật khẩu phải có ít nhất 6 ký tự'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Tên người dùng phải từ 7 đến 20 ký tự')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Tên người dùng không được chứa khoảng trắng'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Tên người dùng phải viết thường'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Tên người dùng chỉ được chứa chữ cái và số')
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if(!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'Bạn không được phép xóa người dùng này'));
  }
  try{
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({message: 'Người dùng đã bị xóa'});
  }
  catch(error) {
    next(error);
  }
}

export const signout = (req, res,next) => {
  try{
    res.clearCookie('access_token')
    .status(200).json({message: 'Đã đăng xuất'});
  }
  catch(error) {
    next(error);
  }
}
export const getUsers = async (req, res, next) => {
  // Kiểm tra xem người dùng hiện tại có phải là admin hay không
  if (!req.user.isAdmin) {
    // Nếu không phải admin, trả về lỗi 403 và không cho phép truy cập
    return next(errorHandler(403, 'Bạn không có quyền truy cập'));
  }

  try {
    // Lấy startIndex từ query string (nếu có), mặc định là 0 nếu không có giá trị
    const startIndex = parseInt(req.query.startIndex) || 0;
    
    // Lấy limit từ query string (nếu có), mặc định là 9 nếu không có giá trị
    const limit = parseInt(req.query.limit) || 9;
    
    // Lấy hướng sắp xếp từ query string: 'asc' (tăng dần) hoặc 'desc' (giảm dần)
    // Mặc định sẽ là giảm dần (sortDirection = -1) nếu không có giá trị
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    // Lấy danh sách người dùng từ cơ sở dữ liệu MongoDB
    // Sắp xếp theo ngày tạo (createdAt), bỏ qua các phần tử trước startIndex, và giới hạn số lượng theo limit
    const users = await User.find()
      .sort({ createdAt: sortDirection }) // Sắp xếp người dùng theo thứ tự tăng hoặc giảm dần
      .skip(startIndex)                   // Bỏ qua các phần tử theo startIndex (phân trang)
      .limit(limit);                      // Giới hạn số lượng người dùng trả về theo limit

    // Loại bỏ trường password khỏi mỗi đối tượng user trước khi trả về
    // Sử dụng map() để duyệt qua từng user và loại trường password bằng cú pháp destructuring
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc; // Lấy tất cả các trường khác ngoài password
      return rest; // Trả về phần còn lại của đối tượng user mà không có password
    });

    // Đếm tổng số người dùng trong cơ sở dữ liệu
    const totalUsers = await User.countDocuments();

    // Tạo một đối tượng Date hiện tại
    const now = new Date();

    // Tạo một đối tượng Date đại diện cho một tháng trước so với ngày hiện tại
    const oneMonthAgo = new Date(
      now.getFullYear(),  // Lấy năm hiện tại
      now.getMonth() - 1, // Lấy tháng trước
      now.getDate()       // Lấy ngày hiện tại
    );

    // Đếm số lượng người dùng được tạo trong khoảng thời gian một tháng vừa qua
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },  // Lọc người dùng có createdAt từ một tháng trước đến hiện tại
    });

    // Trả về response với các thông tin:
    // 1. Danh sách người dùng không chứa password
    // 2. Tổng số người dùng
    // 3. Số lượng người dùng được tạo trong một tháng qua
    res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    // Nếu có lỗi xảy ra, chuyển lỗi sang middleware xử lý lỗi
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
