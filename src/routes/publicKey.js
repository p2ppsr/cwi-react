const express = require('express')
const router = express.Router()
const publicKeyController = require('../controllers/publicKey')
router[publicKeyController.getPublicKey.type](publicKeyController.getPublicKey.path, publicKeyController.getPublicKey.func)

module.exports = router
