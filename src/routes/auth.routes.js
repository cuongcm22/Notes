const express = require('express');
const router = express.Router();

const UserController = require('../controllers/auth.controllers'); 

// Route để lấy danh sách người dùng
router.get('/getall', UserController.getAllUsers);

// Route để tạo một người dùng mới
router.post('/create', UserController.createUser);

// Cập nhật thông tin người dùng
router.put('/update', UserController.updateUser);

// Route để xóa một người dùng dựa trên email
router.delete('/delete/:email', UserController.deleteUser);

module.exports = router;