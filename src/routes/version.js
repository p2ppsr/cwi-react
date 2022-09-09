const express = require('express')
const router = express.Router()
const versionController = require('../controllers/version')
router[versionController.getVersion.type](versionController.getVersion.path, versionController.getVersion.func)

module.exports = router
