const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const {
    Note
} = require('../models/models') 

// Đọc nội dung từ file HTML dựa trên ObjectId của Note
async function getContentHtmlFile(noteId) {
  try {
   
    const note = await Note.findOne({noteID: noteId}).exec();

    if (!note) {
      throw new Error('Note not found');
    }

    // Tạo đường dẫn file HTML từ noteId
    const htmlFilePath = note.editorURI;

    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(htmlFilePath)) {
      throw new Error('HTML file not found for the given Note ID');
    }

    // Đọc nội dung file HTML
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
   
    // Trả về nội dung của file HTML
    return htmlContent;

  } catch (error) {
    console.error('Error fetching note HTML content:', error);
    throw error;
  }
}

module.exports = getContentHtmlFile;
