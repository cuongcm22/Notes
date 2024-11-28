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
router.get('/masonry', authServer, noteControllers.showMasonryNotesPage)

// Show list note page
router.get('/crud', authServer, noteControllers.showTableNotesPage)

// Read note (pagination:total item)
router.get('/read/:pagination', noteControllers.getPaginationNoteRoute)

// Get content notes
router.get('/get/:noteid', authServer, noteControllers.getContentHtmlFile)

// show Edit content notes page
router.get('/edit/:noteid', authServer, noteControllers.showEditNotesPage)

// Update content notes
router.post('/edit/:noteid', authServer, noteControllers.updateContentNotes)

// Delete route notes
router.post('/delete/:noteid', authServer, noteControllers.deleteNotes)


module.exports = router