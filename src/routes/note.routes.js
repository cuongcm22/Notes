const express = require('express');
const router = express.Router();
const settingMulter = require('../modules/settingMulter.module')
const authServer = require('../modules/authServer.module')


const { noteControllers } = require('../controllers/note.controllers')

// Show createNote Page
router.get('/create', noteControllers.showCreateNotePage)

// Upload note file 
// router.post('/create', authServer, settingMulter, noteControllers.uploadHTMLEditor)
router.post('/create', authServer, noteControllers.uploadNotePage)

module.exports = router