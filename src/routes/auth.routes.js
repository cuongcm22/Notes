const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controllers'); 

// Display admin management user page

router.get('/mangagement/users', authController.showAdminManageUserPage)

// Route để lấy danh sách người dùng
router.get('/getall', authController.getAllUsers);

// Route để tạo một người dùng mới
router.post('/create', authController.createUser);

// Cập nhật thông tin người dùng
router.put('/update', authController.updateUser);

// Route để xóa một người dùng dựa trên email
router.delete('/delete/:email', authController.deleteUser);

module.exports = router;