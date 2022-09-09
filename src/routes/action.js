const express = require('express')
const router = express.Router()
const actionController = require('../controllers/action')
router[actionController.createAction.type](actionController.createAction.path, actionController.createAction.func)

module.exports = router
