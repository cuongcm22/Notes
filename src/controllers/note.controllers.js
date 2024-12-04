const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const checkRole = require('../common/roleCheck.common')
const uploadHTMLEditor = require('../modules/uploadHTMLEditor.module')
const updateHTMLEditor = require('../modules/updateHTMLEditor.module.js')
const elasticsearchModule = require('../modules/elasticSearch.module');

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

            const user = await User.findOne({ email: userSession.email })

            const { title, title1, title2, title3, desc, desc1, desc2, desc3, htmleditor } = req.body;
      
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
                    title: JSON.parse(title), // Chuyển đổi JSON string thành object
                    title1: JSON.parse(title1),
                    title2: JSON.parse(title2),
                    title3: JSON.parse(title3),
                    desc: JSON.parse(desc),
                    desc1: JSON.parse(desc1),
                    desc2: JSON.parse(desc2),
                    desc3: JSON.parse(desc3),
                    imageURI: randomImage(),
                    editorURI: htmlResponse.location, // Lưu đường dẫn file HTML vào editorURI
                });

                // Lưu note vào cơ sở dữ liệu
                await newNote.save()

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
            // Lấy thông tin người dùng từ session
            const userSession = req.usersession;
            const user = await User.findOne({ email: userSession.email });

            if (!user) {
                return res.render('404', { message: 'User not found' });
            }

            res.render('notes/table.note.pug');
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

            res.render('notes/edit.note.pug', { note: note, htmlContent: htmlContent, noteid: noteId })
        } catch (error) {
            console.error(error);
            res.render('500', { message: 'An error occurred while fetching the notes' });
        }
    }

    async updateContentNotes(req, res) {
        try {
            const noteid = req.params.noteid;  // Lấy noteid từ route parameter
            const { title, title1, title2, title3, desc, desc1, desc2, desc3, htmleditor } = req.body;  // Lấy dữ liệu từ request body

            // Kiểm tra dữ liệu có hợp lệ không
            if (!title || !desc || !htmleditor) {
                return res.status(200).send(AlertCommon.danger('Thiếu thông tin cần thiết!' ));
            }
    
            // Tìm ghi chú trong database
            const note = await Note.findOne({ noteID: noteid });
    
            if (!note) {
                return res.status(200).send(AlertCommon.danger('Ghi chú không tồn tại!' ));
            }
    
            // Cập nhật nội dung các trường trong database
            note.title = JSON.parse(title);     // Chuyển đổi từ JSON string thành object
            note.title1 = JSON.parse(title1);
            note.title2 = JSON.parse(title2);
            note.title3 = JSON.parse(title3);
            note.desc = JSON.parse(desc);
            note.desc1 = JSON.parse(desc1);
            note.desc2 = JSON.parse(desc2);
            note.desc3 = JSON.parse(desc3);
            note.updatedAt = Date.now();  // Cập nhật thời gian sửa đổi
    
            // Lưu thông tin mới vào MongoDB
            await note.save();
    
            // Cập nhật nội dung HTML trong file sử dụng module updateHTMLEditor
            const fileUpdateResponse = await updateHTMLEditor(note.editorURI, htmleditor);
    
            if (!fileUpdateResponse) {
                res.status(200).send(AlertCommon.danger('An error occurred while updating the HTML content' ));
            }
    
            // Trả về thông báo thành công
            return res.status(200).send(AlertCommon.info('Cập nhật ghi chú thành công!' ));
        } catch (error) {
            console.error(error);
            return res.status(200).send(AlertCommon.danger( 'Đã xảy ra lỗi khi cập nhật ghi chú.' ));
        }
    }

    async getPaginationNoteRoute(req, res) {
        try {

            // Get user session
            const userSession = req.usersession;
            const user = await User.findOne({ email: userSession.email });
            // const user = await User.findOne({ email: 'user1@example.com' });

            if (!user) {

                return res.render('404', { message: 'User not found' });
            }

            // Get total items (notes count)
            const totalItems = await Note.countDocuments({ userID: user._id });

            // For now, let's assume pagination starts from page 1
            const { pagination } = req.params

            const paginationData = await getPaginationNote({ params: { pagination, totalItems, user } }, res);

            // Extract the notes and pagination info from paginationData
            const { notes, pagination: paginationInfo } = paginationData;

            return res.status(200).json({ notes, pagination: paginationInfo })
        } catch {

        }
    }


    async deleteNotes(req, res) {
        try {
            // Lấy noteID từ params hoặc body
            const { noteid } = req.params;

            // Tìm và xóa note dựa trên noteID
            const deletedNote = await Note.findOneAndDelete({ noteID: noteid });

            // Kiểm tra nếu không tìm thấy note với noteID đó
            if (!deletedNote) {
                return res.status(200).send(AlertCommon.info('Có lỗi xảy ra!'))
            }

            // Trả về kết quả thành công
            return res.status(200).send(AlertCommon.danger('Xóa note thành công!'))
        } catch (error) {

            console.error(error);
            res.render('500', { message: 'An error occurred while fetching the notes' });
        }
    }

    async searchNotes(req, res) {
        try {
            // Lấy thông tin người dùng từ session
            const usersession = req.usersession;
            const user = await User.findOne({ email: usersession.email });
    
            const { value } = req.params; // Lấy giá trị tìm kiếm từ params
    
            // Tạo query tìm kiếm trong tất cả các trường title và desc (chỉ trong trường content)
            let query = {
                userID: user._id, // Lọc theo userID
                $or: [
                    { 'title.content': new RegExp(value, 'i') },   // Tìm trong trường title.content
                    { 'title1.content': new RegExp(value, 'i') },  // Tìm trong trường title1.content
                    { 'title2.content': new RegExp(value, 'i') },  // Tìm trong trường title2.content
                    { 'title3.content': new RegExp(value, 'i') },  // Tìm trong trường title3.content
                    { 'desc.content': new RegExp(value, 'i') },    // Tìm trong trường desc.content
                    { 'desc1.content': new RegExp(value, 'i') },   // Tìm trong trường desc1.content
                    { 'desc2.content': new RegExp(value, 'i') },   // Tìm trong trường desc2.content
                    { 'desc3.content': new RegExp(value, 'i') },   // Tìm trong trường desc3.content
                ]
            };
    
            // Thực hiện tìm kiếm
            const notes = await Note.find(query).exec();
    
            // Trả về kết quả tìm kiếm
            return res.status(200).json({ notes });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi tìm kiếm ghi chú' });
        }
    }
}

const noteControllers = new NoteControllers()

module.exports = {
    noteControllers
}