const CWI = require('@cwi/core')
const createAction = {
  type: 'post',
  path: '/createAction',
  summary: 'Creates and broadcasts a BitCoin transaction with the provided inputs and outputs.',
  body: {
    inputs: 'Input scripts to spend as part of this Action. This is an object whose keys are TXIDs and whose values are Everett-style transaction envelopes that contain an additional field called outputsToRedeen. This additional field is an array of objects, each containing index and unlockingScript properties. The index property is the output number in the transaction you are spending, and unlockingScript is the hex-encoded Bitcoin script that unlocks and spends the output. Any signatures should be created with SIGHASH_NONE | ANYONECANPAY so that additional modifications to the resulting transaction can be made afterward without invalidating them. You may substitute SIGHASH_NONE for SIGHASH_SINGLE if required for a token contract, or drop ANYONECANPAY if you are self-funding the Action.',
    outputs: 'The array of transaction outputs (amounts and scripts) that you want in the transaction. Each object contains "satoshis" and "script", which can be any custom locking script of your choosing.',
    description: 'A present-tense description of the user Action being facilitated or represented by this BitCoin transaction.',
    bridges: 'Bridgeport bridges to notify about this Action. (optional, default [])',
    labels: 'Labels to apply to this Action. (optional, default [])'
  },
  exampleResponse: {
    status: 'success',
    result: {
      txid: '',
      rawTx: '',
      mapiResponses: [],
      inputs: []
    }
  },
  func: async (req, res) => {
    try {
      const result = await CWI.createAction({
        ...req.body,
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
module.exports = { createAction }
