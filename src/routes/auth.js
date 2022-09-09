const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
for (const route in authController) {
  router[authController[route].type](authController[route].path, authController[route].func)
}

module.exports = router
