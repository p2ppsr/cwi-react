const CWI = require('@cwi/core')
const createSignature = {
  type: 'post',
  path: '/createSignature',
  summary: 'Creates a digital signature with a key belonging to the user. The SHA-256 hash of the data is used with ECDSA.',
  parameters: {
    protocolID: 'Specify an identifier for the protocol under which this operation is being performed.',
    keyID: 'An identifier for the message being signed. During verification, or when retrieving the public key used, the same message ID will be required. This can be used to prevent key re-use, even when the same user is using the same protocol to sign multiple messages.',
    description: 'Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.',
    counterparty: 'If specified, the user with this identity key will also be able to verify the signature, as long as they specify the current user\'s identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone". (optional, default anyone)',
    privileged: 'This indicates whether the privileged keyring should be used for signing, as opposed to the primary keyring. (optional, default false)'
  },
  body: {
    primaryParameter: 'the data to sign.'
  },
  exampleResponse: {
    data: 'The ECDSA message signature as a Uint8Array buffer'
  },
  func: async (req, res) => {
    try {
      let data = req.body
      if (data.constructor === Buffer) {
        data = Uint8Array.from(data)
      } else if (data.constructor !== Uint8Array) {
        const e = new Error('Data to sign must be formatted as a buffer!')
        e.code = 'ERR_INVALID_REQUEST_BODY'
        throw e
      }
      const result = await CWI.createSignature({
        ...req.query,
        data,
        originator: req.originator
      })
      if (result.constructor === Uint8Array) {
        // Send the data as a buffer
        res.setHeader('content-type', 'application/octet-stream')
        res.write(result, 'binary')
        res.end(null, 'binary')
      } else {
        const e = new Error('Unexpected return type of ' + result.constructor)
        e.code = 'ERR_BAD_REQUEST'
        throw e
      }
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
const verifySignature = {
  type: 'post',
  path: '/verifySignature',
  summary: 'Verifies that a digital signature was created with a key belonging to the user.',
  parameters: {
    signature: 'The signature to verify, in the same format returned when it was created.',
    protocolID: 'Specify the identifier for the protocol under which the data was signed.',
    keyID: 'An identifier for the message that was signed. This should be the same message ID that was used when creating the signature.',
    description: 'Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.',
    counterparty: 'If specified, allows verification where the user with this identity key has created the signature, as long as they had specified the current user\'s identity key as their counterparty during creation. Must be a hexadecimal string representing a 33-byte or 65-byte value or "self". Note that signatures created with counterparty = "anyone" are verifiable by anyone, and do not need user keys through the kernel. (optional, default self)',
    privileged: 'This indicates whether the privileged keyring was used for signing, as opposed to the primary keyring. (optional, default false)'
  },
  body: {
    primaryParameter: 'the data that was signed'
  },
  exampleResponse: {
    status: 'success',
    result: true
  },
  func: async (req, res) => {
    try {
      let data = req.body
      if (req.body.constructor === Buffer) {
        data = Uint8Array.from(req.body)
      } else if (data.constructor !== Uint8Array) {
        const e = new Error('Signed data to verify must be formatted as a buffer!')
        e.code = 'ERR_INVALID_REQUEST_BODY'
        throw e
      }
      const result = await CWI.verifySignature({
        ...req.query,
        data,
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
module.exports = { createSignature, verifySignature }
