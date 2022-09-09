const express = require('express')
const router = express.Router()
const hmacController = require('../controllers/hmac')
for (const route in hmacController) {
  router[hmacController[route].type](hmacController[route].path, hmacController[route].func)
}

module.exports = router
