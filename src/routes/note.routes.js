const express = require('express');
const router = express.Router();
const uploadModule = require('../modules/uploadModule')
const authenServer = require('../modules/authServer')


const { noteControllers } = require('../controllers/note.controllers')

// Show signin page
// router.post('/create', authenServer.authenToken, uploadModule, noteControllers.createCkeditor)

module.exports = router