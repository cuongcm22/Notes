const express = require('express');
const router = express.Router();

const UserController = require('../controllers/auth.controllers'); 

// Route để lấy danh sách người dùng
router.get('/getall', UserController.getAllUsers);

// Route để tạo một người dùng mới
router.post('/users', UserController.createUser);

// Route để xóa một người dùng dựa trên email
router.delete('/users/:email', UserController.deleteUser);

module.exports = router;