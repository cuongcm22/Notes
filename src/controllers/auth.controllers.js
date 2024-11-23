const { 
  User
} = require('../models/models'); // Đường dẫn đến User Model

class UserController {
  // Lấy danh sách tất cả người dùng
  async getAllUsers(req, res) {
    try {
      // Lấy tham số từ query string
      const page = parseInt(req.query.page, 10) || 1; // Trang hiện tại (mặc định là 1)
      const limit = parseInt(req.query.limit, 10) || 20; // Số lượng người dùng mỗi trang (mặc định là 20)
      const skip = (page - 1) * limit;

      // Đếm tổng số người dùng
      const totalItems = await User.countDocuments();

      // Lấy danh sách người dùng với phân trang
      const arrayUser = await User.find({}, { _id: 0, __v: 0 }).skip(skip).limit(limit).sort({ _id: -1 });;

      // Tính toán thông tin phân trang
      const totalPages = Math.ceil(totalItems / limit);

      const pagination = {
        totalItems,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
      };

      // Trả về kết quả
      res.status(200).json({ arrayUser, pagination });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }

  // Tạo một người dùng mới
  async createUser(req, res) {
    const { name, email, password, role } = req.body;

    try {
      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }

      // Tạo người dùng mới
      const newUser = new User({ name, email, password, role });
      await newUser.save();

      res.status(201).json({ message: 'Người dùng đã được tạo thành công', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }

  // Xóa một người dùng dựa trên email
  async deleteUser(req, res) {
    const { email } = req.params;

    try {
      const deletedUser = await User.findOneAndDelete({ email });
      if (!deletedUser) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });
      }

      res.status(200).json({ message: 'Người dùng đã được xóa thành công', user: deletedUser });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }
}

// Khởi tạo instance của UserController
module.exports = new UserController();
