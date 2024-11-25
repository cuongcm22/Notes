const express = require('express');
const router = express.Router();
const settingMulter = require('../modules/settingMulter.module')
const authServer = require('../modules/authServer.module')


const { noteControllers } = require('../controllers/note.controllers')

// Show createNote Page
router.get('/create', authServer, noteControllers.showCreateNotePage)

// Upload note file 
// router.post('/create', authServer, settingMulter, noteControllers.uploadHTMLEditor)
router.post('/create', authServer, noteControllers.uploadNotePage)

// Show list note page
router.get('/list', authServer, noteControllers.showListNotesPage)

// Get content notes
router.get('/get/:noteid', noteControllers.getContentHtmlFile)

// show Edit content notes page
router.get('/edit/:noteid', noteControllers.showEditNotesPage)

// Update content notes
router.post('/edit/:noteid', noteControllers.updateContentNotes)

module.exports = router