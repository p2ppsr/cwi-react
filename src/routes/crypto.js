const express = require('express')
const router = express.Router()
const cryptoController = require('../controllers/crypto')
for (const route in cryptoController) {
  router[cryptoController[route].type](cryptoController[route].path, cryptoController[route].func)
}

module.exports = router
