const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const checkRole = require('../common/roleCheck.common')
const uploadHTMLEditor = require('../modules/uploadHTMLEditor.module')

const {
    User,
    Note
} = require('../models/models')

// Đường dẫn mới tới thư mục upload
const uploadFolder = path.join(__dirname, '..', 'upload');  // Cập nhật đường dẫn

class NoteControllers {

    async showCreateNotePage(req, res) {
        try {
      
            res.render('notes/create.note.pug')
          } 
          catch (error) {
            res.render('404')
          }
    }

    async uploadNotePage(req, res) {
        try {
            console.log('Create note route');
            const userSession = req.usersession
            checkRole.checkAdmin(userSession.role, res)
            const user = await User.findOne({email: userSession.email})

            const { title, desc, htmleditor } = req.body;
    
            // Kiểm tra xem htmleditor có tồn tại trong request hay không
            if (!htmleditor) {
                return res.status(400).json({ message: 'HTML editor content is required' });
            }
    
            // Gửi nội dung HTML lên route uploadHTMLEditor để xử lý
            const htmlResponse = await uploadHTMLEditor({ body: { editor: htmleditor } }, res);
            
            if (htmlResponse && htmlResponse.location) {
                // Nếu việc tạo file HTML thành công, tiến hành tạo note mới
                const newNote = new Note({
                    userID: user,
                    title,
                    desc,
                    editorURI: htmlResponse.location, // Lưu đường dẫn file HTML vào editorURI
                });
    
                // Lưu note vào cơ sở dữ liệu
                await newNote.save();
    
                return res.status(201).json({
                    message: 'Note created successfully',
                    note: newNote,
                });
            } else {
                // Nếu upload file thất bại, trả về lỗi
                return res.status(500).json({ message: 'Failed to upload HTML content' });
            }
        } catch (error) {
            // Bắt lỗi và trả về phản hồi nếu có lỗi xảy ra
            console.error(error);
            return res.status(500).json({ message: 'Error while creating note', error: error.message });
        }
    }

    async showListNotesPage(req, res) {
        try {
          res.render('notes/list.note.pug')
        } 
        catch (error) {
          res.render('404')
        }
    }

}

const noteControllers = new NoteControllers()

module.exports = {
    noteControllers
}