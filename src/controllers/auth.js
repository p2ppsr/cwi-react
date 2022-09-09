const CWI = require('@cwi/core')
const checkStatus = {
  type: 'get',
  path: '/isAuthenticated',
  summary: 'Checks if a user is currently authenticated.',
  exampleResponse: {
    status: 'success',
    result: true
  },
  func: async (req, res) => {
    try {
      const result = await CWI.isAuthenticated({
        originator: req.originator
      })
      res.json({
        status: 'success',
        result
      })
    } catch (e) {
      console.error(e)
      res.status(400).json({
        status: 'error',
        code: e.code || 'ERR_INTERNAL',
        description: e.message
      })
    }
  }
}
const wait = {
  type: 'post',
  path: '/waitForAuthentication',
  summary: 'Waits for a user to be authenticated.',
  exampleResponse: {
    status: 'success',
    result: true
  },
  func: async (req, res) => {
    try {
      const result = await CWI.waitForAuthentication({
        originator: req.originator
      })
      res.status(200).json({
        status: 'success',
        result
      })
    } catch (e) {
      res.status(400).json({
        status: 'error',
        code: e.code || 'ERR_INTERNAL',
        description: e.message
      })
    }
  }
}
module.exports = { wait, checkStatus }
