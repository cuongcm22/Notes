const express = require('express');
const router = express.Router();
const settingMulter = require('../modules/settingMulter.module')
const uploadHTMLEditor = require('../modules/uploadHTMLEditor.module')
const authServer = require('../modules/authServer.module')

router.post('/htmlfile', settingMulter, uploadHTMLEditor)

module.exports = router