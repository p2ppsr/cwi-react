const express = require('express')
const router = express.Router()
const signatureController = require('../controllers/signature')
for (const route in signatureController) {
  router[signatureController[route].type](signatureController[route].path, signatureController[route].func)
}
module.exports = router
