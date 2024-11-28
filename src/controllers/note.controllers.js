const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const checkRole = require('../common/roleCheck.common')
const uploadHTMLEditor = require('../modules/uploadHTMLEditor.module')
const updateHTMLEditor = require('../modules/updateHTMLEditor.module.js')

const {
    User,
    Note
} = require('../models/models')

const AlertCommon = require('../common/alert.common')
const errorServer = AlertCommon.danger('Có lỗi xảy ra, vui lòng liên hệ admin để giải quyết!')
const randomImage = require('../common/selectRandomImage.common')
const getContentHtmlFileModule = require('../common/getContentHTMLFile.js')
const getPaginationNote = require('../common/getPagiantionsNote.js')
const generateID = require('../common/generateID.js')

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
            const user = await User.findOne({ email: userSession.email })

            const { title, desc, htmleditor } = req.body;

            // Kiểm tra xem htmleditor có tồn tại trong request hay không
            if (!htmleditor) {
                return res.status(201).render('500')
            }

            // Gửi nội dung HTML lên route uploadHTMLEditor để xử lý
            const htmlResponse = await uploadHTMLEditor({ body: { editor: htmleditor } }, res);

            if (htmlResponse && htmlResponse.location) {

                const noteID = await generateID(Note, 'noteID');

                // Nếu việc tạo file HTML thành công, tiến hành tạo note mới
                const newNote = new Note({
                    noteID: noteID,
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

    async showMasonryNotesPage(req, res) {
        try {
            // Lấy thông tin người dùng từ session
            const userSession = req.usersession;
            const user = await User.findOne({ email: userSession.email });

            if (!user) {
                return res.render('404', { message: 'User not found' });
            }

            // Lấy tất cả các note của người dùng dựa trên userID
            const notes = await Note.find({ userID: user._id });

            const notesID = notes.map(note => note.noteID)
            // Tạo các mảng cần thiết: arrayImages, titles, descs
            const arrayImages = notes.map(note => note.imageURI);
            const titles = notes.map(note => note.title);
            const descs = notes.map(note => note.desc);

            res.render('notes/list.note.pug', { notesID, arrayImages, titles, descs });
        } catch (error) {
            console.error(error);
            res.render('500', { message: 'An error occurred while fetching the notes' });
        }
    }

    async showTableNotesPage(req, res) {
        try {
            // Get user session
            const userSession = req.usersession;
            const user = await User.findOne({ email: userSession.email });

            if (!user) {
                return res.render('404', { message: 'User not found' });
            }

            // Get total items (notes count)
            const totalItems = await Note.countDocuments({ userID: user._id });

            // For now, let's assume pagination starts from page 1
            const pagination = 1;

            // Call getPaginationNote directly (without fetch)
            const paginationData = await getPaginationNote({ params: { pagination, totalItems } }, res);

            // Extract the notes and pagination info from paginationData
            const { notes, pagination: paginationInfo } = paginationData;

            // Prepare the data for rendering
            const notesID = notes.map(note => note.noteID);
            const arrayImages = notes.map(note => note.imageURI);
            const titles = notes.map(note => note.title);
            const descs = notes.map(note => note.desc);
            const updatedAt = notes.map(note => note.updatedAt);
            const createdAt = notes.map(note => note.createdAt);

            // Render the table page with the notes and pagination info
            res.render('notes/table.note.pug', { 
                notesID, arrayImages, titles, descs, updatedAt, createdAt,
                pagination: paginationInfo.showing, totalPages: paginationInfo.totalPages,
                currentPage: paginationInfo.currentPage
            });
        } catch (error) {
            console.error(error);
            res.render('500', { message: 'An error occurred while fetching the notes' });
        }
    }

    async getContentHtmlFile(req, res) {
        try {
            const noteID = req.params.noteid

            const htmlContent = await getContentHtmlFileModule(noteID)
            // console.log(htmlContent);
            res.status(200).json({ htmlContent })
        } catch (error) {
            console.error(error);
            res.render('500', { message: 'An error occurred while fetching the notes' });
        }
    }

    async showEditNotesPage(req, res) {
        try {
            const noteId = req.params.noteid

            const note = await Note.findOne({ noteID: noteId })

            const htmlContent = await getContentHtmlFileModule(noteId)
            
            res.render('notes/edit.note.pug', { title: note.title, desc: note.desc, htmlContent: htmlContent, noteid: noteId })
        } catch (error) {
            console.error(error);
            res.render('500', { message: 'An error occurred while fetching the notes' });
        }
    }

    async updateContentNotes(req, res) {
        try {
            const noteid = req.params.noteid;  // Lấy noteid từ route parameter
            const { title, description, content } = req.body;  // Lấy dữ liệu từ request body
      
            // Kiểm tra dữ liệu có hợp lệ không
            if (!title || !description || !content) {
                return res.status(400).json({ message: 'Thiếu thông tin cần thiết!' });
            }

            // Tìm ghi chú trong database
            const note = await Note.findOne({ noteID: noteid });

            if (!note) {
                return res.status(404).json({ message: 'Ghi chú không tồn tại!' });
            }

            // Cập nhật nội dung ghi chú vào database
            note.title = title;
            note.desc = description;

            // Lưu thông tin mới vào MongoDB
            await note.save();

            // Cập nhật nội dung HTML trong file sử dụng module updateHTMLEditor
            const fileUpdateResponse = await updateHTMLEditor(note.editorURI, content)

            if (!fileUpdateResponse) {
                return res.render('500', { message: 'An error occurred while fetching the notes' });
            }

            // Trả về thông báo thành công
            return res.status(200).send(AlertCommon.info('Cập nhật ghi chú thành công!'))
        } catch (error) {
            console.error(error);
            res.render('500', { message: 'An error occurred while fetching the notes' });
        }
    }

    async getPaginationNoteRoute(req, res) {
        try {
          
            // Get user session
            // const userSession = req.usersession;
            // const user = await User.findOne({ email: userSession.email });
            const user = await User.findOne({ email: 'user1@example.com' });
      
            if (!user) {
             
                return res.render('404', { message: 'User not found' });
            }

            // Get total items (notes count)
            const totalItems = await Note.countDocuments({ userID: user._id });

            // For now, let's assume pagination starts from page 1
            const {pagination} = req.params

            const paginationData = await getPaginationNote({ params: { pagination, totalItems } }, res);
      
            // Extract the notes and pagination info from paginationData
            const { notes, pagination: paginationInfo } = paginationData;

            return res.status(200).json({ notes, pagination: paginationInfo })
        } catch {

        }
    }

}

const noteControllers = new NoteControllers()

module.exports = {
    noteControllers
}