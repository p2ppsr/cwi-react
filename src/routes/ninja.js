const express = require('express')
const router = express.Router()
const ninjaController = require('../controllers/ninja')
for (const route in ninjaController) {
  router[ninjaController[route].type](ninjaController[route].path, ninjaController[route].func)
}
module.exports = router
