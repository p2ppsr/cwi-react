const CWI = require('@cwi/core')
const getAvatar = {
  type: 'get',
  path: '/ninja/avatar',
  summary: 'Returns the name and photo URL of the user',
  exampleResponse: {
    status: 'success',
    result: {
      name: 'bob',
      photoURL: 'null'
    }
  },
  func: async (req, res) => {
    try {
      const ninja = CWI.getNinja()
      const result = await ninja.getAvatar({
        originator: req.originator
      })
      res.status(200).json({
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
const getPaymail = {
  type: 'get',
  path: '/ninja/paymail',
  summary: 'Returns the current Paymail handle',
  exampleResponse: {
    status: 'success',
    result: 'bob@babbage.com'
  },
  func: async (req, res) => {
    try {
      const ninja = CWI.getNinja()
      const result = await ninja.getPaymail({
        originator: req.originator
      })
      res.status(200).json({
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
module.exports = { getAvatar, getPaymail }
