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

router.get('/list', authServer, noteControllers.showListNotesPage)



module.exports = router