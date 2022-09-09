const CWI = require('@cwi/core')
const getVersion = {
  type: 'get',
  path: '/version',
  summary: 'Returns the current version of the kernal.',
  exampleResponse: {
    status: 'success',
    result: '0.3.11'
  },
  func: async (req, res) => {
    try {
      const result = await CWI.getVersion({
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
module.exports = { getVersion }
