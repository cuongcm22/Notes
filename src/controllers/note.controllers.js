const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const checkRole = require('../common/roleCheck.common')
const uploadHTMLEditor = require('../modules/uploadHTMLEditor.module')

const {
    User,
    Note
} = require('../models/models')

const AlertCommon = require('../common/alert.common')
const errorServer = AlertCommon.danger('Có lỗi xảy ra, vui lòng liên hệ admin để giải quyết!')
const randomImage = require('../common/selectRandomImage.common')

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
           
            const userSession = req.usersession
            checkRole.checkAdmin(userSession.role, res)
            const user = await User.findOne({email: userSession.email})

            const { title, desc, htmleditor } = req.body;
    
            // Kiểm tra xem htmleditor có tồn tại trong request hay không
            if (!htmleditor) {
                return res.status(201).render('500')
            }
    
            // Gửi nội dung HTML lên route uploadHTMLEditor để xử lý
            const htmlResponse = await uploadHTMLEditor({ body: { editor: htmleditor } }, res);
            
            if (htmlResponse && htmlResponse.location) {
                // Nếu việc tạo file HTML thành công, tiến hành tạo note mới
                const newNote = new Note({
                    userID: user,
                    title,
                    desc,
                    imageURI: randomImage(),
                    editorURI: htmlResponse.location, // Lưu đường dẫn file HTML vào editorURI
                });
    
                // Lưu note vào cơ sở dữ liệu
                await newNote.save();
    
                return res.status(200).send(AlertCommon.info('Lưu thành công!'))
            } else {
                // Nếu upload file thất bại, trả về lỗi
                return res.status(201).send(AlertCommon.danger('Lỗi khi tạo mới!'))
            }
        } catch (error) {
            // Bắt lỗi và trả về phản hồi nếu có lỗi xảy ra
            console.error(error);
            return res.render('500')
        }
    }

    async showListNotesPage(req, res) {
        try {
            // Lấy thông tin người dùng từ session
            const userSession = req.usersession;
            const user = await User.findOne({ email: userSession.email });
    
            if (!user) {
                return res.render('404', { message: 'User not found' });
            }
            
            // Lấy tất cả các note của người dùng dựa trên userID
            const notes = await Note.find({ userID: user._id });
    
            // Tạo các mảng cần thiết: arrayImages, titles, descs
            const arrayImages = notes.map(note => note.imageURI);
            const titles = notes.map(note => note.title);
            const descs = notes.map(note => note.desc);
           
            res.render('notes/list.note.pug', { arrayImages, titles, descs });
        } catch (error) {
            console.error(error);
            res.render('404', { message: 'An error occurred while fetching the notes' });
        }
    }

}

const noteControllers = new NoteControllers()

module.exports = {
    noteControllers
}