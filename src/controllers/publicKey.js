const CWI = require('@cwi/core')
const getPublicKey = {
  type: 'get',
  path: '/publicKey',
  summary: 'Returns the public key for the current user associated with the protocolID and keyID specified.',
  parameters: {
    protocolID: 'Specify an identifier for the protocol under which this operation is being performed.',
    keyID: 'Identifier for the request.',
    counterparty: '(optional) defaults to self.',
    privileged: '(optional) defaults to false.',
    identityKey: '(optional) defaults to false.',
    reason: '(optional) reason for the request.'
  },
  exampleResponse: {
    status: 'success',
    result: '0239da3ba5e08896ace4595752aad67a6eafe0aab643b4c5029b08c001f30c7ec3'
  },
  func: async (req, res) => {
    try {
      const result = await CWI.getPublicKey({
        ...req.query,
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
module.exports = { getPublicKey }
