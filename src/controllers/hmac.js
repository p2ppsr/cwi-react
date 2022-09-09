const CWI = require('@cwi/core')
const createHmac = {
  type: 'post',
  path: '/createHmac',
  summary: 'Creates a SHA-256 HMAC with a key belonging to the user.',
  parameters: {
    protocolID: 'Specify an identifier for the protocol under which this operation is being performed.',
    keyID: 'An identifier for the message. During verification, the same message ID will be required. This can be used to prevent key re-use, even when the same user is using the same protocol to HMAC multiple messages.',
    description: 'Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.',
    counterparty: 'If specified, the user with this identity key will also be able to verify the HMAC, as long as they specify the current user\'s identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone". (optional, default self)',
    privileged: 'This indicates whether the privileged keyring should be used for the HMAC, as opposed to the primary keyring. (optional: defaults to false)'
  },
  body: {
    primaryParameter: 'data to HMAC.'
  },
  exampleResponse: {
    data: '<The SHA-256 HMAC of the data as a Uint8Array Buffer>'
  },
  func: async (req, res) => {
    try {
      let data = req.body
      if (data.constructor === Buffer) {
        data = Uint8Array.from(data)
      } else if (data.constructor !== Uint8Array) {
        const e = new Error('Data to HMAC must be formated as a buffer!')
        e.code = 'ERR_INVALID_REQUEST_BODY'
        throw e
      }
      const result = await CWI.createHmac({
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
      res.setHeader('content-type', 'application/json')
      res.status(400).json({
        status: 'error',
        code: e.code || 'ERR_INTERNAL',
        description: e.message
      })
    }
  }
}
const verifyHmac = {
  type: 'post',
  path: '/verifyHmac',
  summary: 'Verifies that a SHA-256 HMAC was created with a key that belongs to the user.',
  parameters: {
    protocolID: 'Specify an identifier for the protocol under which the HMAC operation was performed.',
    keyID: 'An identifier for the message. This should be the same message ID that was used when creating the HMAC.',
    description: 'Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.',
    counterparty: 'If specified, allows verification where the user with this identity key has created the HMAC, as long as they had specified the current user\'s identity key as their counterparty during creation. Must be a hexadecimal string representing a 33-byte or 65-byte value or "self". Note that signatures created with counterparty = "anyone" are verifiable by anyone, and do not need user keys through the kernel. (optional, default self)',
    privileged: 'This indicates whether the privileged keyring was used for the HMAC, as opposed to the primary keyring. (optional, default false)',
    hmac: 'The HMAC to use for verification.'
  },
  body: {
    primaryParameter: 'the data to verify.'
  },
  exampleResponse: {
    status: 'success',
    result: true
  },
  func: async (req, res) => {
    try {
      let data = req.body
      if (data.constructor === Buffer) {
        data = Uint8Array.from(data)
      } else if (data.constructor !== Uint8Array) {
        const e = new Error('Data to verify must be formatted as a buffer!')
        e.code = 'ERR_INVALID_REQUEST_BODY'
        throw e
      }
      const result = await CWI.verifyHmac({
        ...req.query,
        data,
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

module.exports = { createHmac, verifyHmac }
