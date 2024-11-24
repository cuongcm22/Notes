const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Đường dẫn mới tới thư mục upload
const uploadFolder = path.join(__dirname, '..', 'upload');  // Cập nhật đường dẫn

class NoteControllers {
    async createCkeditor(req, res) {
        try {
            const editorContent = req.body.editor;
            // Sử dụng Cheerio để xử lý HTML
            const $ = cheerio.load(editorContent);
            // Xóa các phần tử không mong muốn
            $('div, svg').remove();

            // Lấy nội dung HTML đã được xử lý
            const cleanContent = $.html();
            
            // Tạo tên file dựa trên số lượng file trong thư mục và timestamp
            const fileIndex = fs.readdirSync(uploadFolder).length + 1;
            const timestamp = Math.floor(new Date().getTime() / 1000) + 7;
            const filename = `Editor_${fileIndex}_${timestamp}.html`;
            const filepath = path.join(uploadFolder, filename);
        
            // Ghi nội dung vào file
            fs.writeFile(filepath, cleanContent, 'utf8', (err) => {
                if (err) {
                    // Nếu có lỗi khi ghi file, trả về lỗi
                    return res.status(500).json({ message: "Lỗi khi tạo file!" });
                }
                
                // Nếu thành công, trả về thông báo thành công
                return res.json({ message: `File ${filename} đã được tạo thành công!` });
            });
            
            // Không cần trả về response ở đây nữa, vì nó đã được gửi trong callback của fs.writeFile
        }
        catch (error) {
            // Xử lý lỗi chung nếu có
            return res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu' });
        }
    }
}

const noteControllers = new NoteControllers()

module.exports = {
    noteControllers
}