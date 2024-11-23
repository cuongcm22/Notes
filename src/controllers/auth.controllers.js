const { 
  User
} = require('../models/models'); // Đường dẫn đến User Model

const AlertCommon = require('../common/alert.common')

const errorServer = AlertCommon.danger('Có lỗi xảy ra, vui lòng liên hệ admin để giải quyết!')

class UserController {
  async showAdminManageUserPage(req, res) {
    try {
      res.render('admin/admin.dashboard')
    } 
    catch (error) {
      res.render('404')
    }
  }

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
        return res.send(AlertCommon.danger('Email đã được sử dụng'))
      }

      // Tạo người dùng mới
      const newUser = new User({ name, email, password, role });
      await newUser.save();

      res.send(AlertCommon.info('Người dùng đã được tạo thành công'))
    } catch (error) {
      
      res.send(errorServer)
    }
  }

  // Xóa một người dùng dựa trên email
  async deleteUser(req, res) {
    const { email } = req.params;

    try {
      const deletedUser = await User.findOneAndDelete({ email });
      if (!deletedUser) {
        return res.send(AlertCommon.danger('Không tìm thấy người dùng với email này!'))
      }

      res.send(AlertCommon.danger('Người dùng đã được xóa thành công!'))
    } catch (error) {
      res.send(errorServer)
    }
  }

  async updateUser(req, res) {
    const { email, name, password, role, phone, address } = req.body;
  
    try {
      // Kiểm tra xem người dùng có tồn tại không
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.send(AlertCommon.danger('Không được sửa email!'));
      }
  
      // Cập nhật thông tin người dùng
      existingUser.name = name || existingUser.name;
      existingUser.password = password || existingUser.password;
      existingUser.role = role || existingUser.role;
      existingUser.phone = phone || existingUser.phone;
      existingUser.address = address || existingUser.address;
  
      // Lưu lại thông tin đã cập nhật
      await existingUser.save();
  
      // Trả về thông báo thành công
      res.send(AlertCommon.info('Thông tin người dùng đã được cập nhật thành công'));
    } catch (error) {
      // Nếu có lỗi trong quá trình thực hiện
      console.error(error);
      res.send(AlertCommon.danger('Đã có lỗi xảy ra khi cập nhật người dùng'));
    }
  }
  
}

// Khởi tạo instance của UserController
module.exports = new UserController();
