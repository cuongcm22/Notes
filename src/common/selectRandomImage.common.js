
const fs = require('fs');
const path = require('path');

/**
 * Hàm chọn ngẫu nhiên hình ảnh từ thư mục ImagesPlaceHolder.
 * @returns {string} Đường dẫn hình ảnh ngẫu nhiên.
 */
function selectRandomImage() {
    // Đường dẫn tới thư mục chứa hình ảnh
    const directoryPath = path.join(__dirname, '..','/assets/Images/ImagesPlaceHolder');

    // Đọc danh sách các tệp trong thư mục
    const files = fs.readdirSync(directoryPath);

    // Lọc ra các tệp có đuôi hình ảnh (ví dụ: .jpg, .png, .jpeg)
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    if (imageFiles.length === 0) {
        throw new Error('Không tìm thấy hình ảnh trong thư mục');
    }

    // Chọn ngẫu nhiên một tệp
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];

    // Trả về đường dẫn hình ảnh
    return `/Images/ImagesPlaceHolder/${randomImage}`;
}

// Sử dụng hàm để lấy hình ảnh ngẫu nhiên
try {
    const randomImagePath = selectRandomImage();
    console.log('Đường dẫn hình ảnh ngẫu nhiên:', randomImagePath);
} catch (error) {
    console.error(error.message);
}

module.exports = selectRandomImage
