const multer = require('multer');

// Cấu hình Multer để lưu trữ file tạm thời
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).none(); // Không cần upload file, chỉ cần form data

module.exports = upload;