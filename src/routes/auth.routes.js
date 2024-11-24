const express = require('express');
const router = express.Router();

const {authController, userController} = require('../controllers/auth.controllers'); 

// ====#==== Auth ====#====
// Show signin page
router.get('/signin', authController.showSignInPage)

// Show register page
router.get('/register', authController.showRegisterPage)

// Show reset password page
router.get('/resetpw', authController.showResetPasswordPage)

// Show forgot password page
router.get('/forgotpw', authController.showForgotPasswordPage)


// ====#==== User ====#====
// Display admin management user page

router.get('/management/users', userController.showAdminManageUserPage)

// Route để lấy danh sách người dùng
router.get('/getall', userController.getAllUsers);

// Route để tạo một người dùng mới
router.post('/create', userController.createUser);

// Cập nhật thông tin người dùng
router.put('/update', userController.updateUser);

// Route để xóa một người dùng dựa trên email
router.delete('/delete/:email', userController.deleteUser);

module.exports = router;