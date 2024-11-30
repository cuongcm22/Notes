const express = require('express');
const router = express.Router();
const authServer = require('../modules/authServer.module')
const authAdmin = require('../modules/authAdmin.module')

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

// Sigin route
router.post('/login', authController.signIn)

// Register route
router.post('/register', authController.register)

// Sign out
router.post('/signout', authController.signout)
// 

// ====#==== User ====#====
// Display admin management user page

router.get('/management/users', authServer, userController.showAdminManageUserPage)

// Route để lấy danh sách người dùng
router.get('/getall', authServer, userController.getAllUsers);

// Route để tạo một người dùng mới
router.post('/create', authServer, userController.createUser);

// Cập nhật thông tin người dùng
router.put('/update', authServer, userController.updateUser);

// Route để xóa một người dùng dựa trên email
router.delete('/delete/:email', authServer, userController.deleteUser);

module.exports = router;