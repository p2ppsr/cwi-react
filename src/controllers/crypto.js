const CWI = require('@cwi/core')
const encryptData = {
  type: 'post',
  path: '/encrypt',
  summary: 'Encrypts data with a key belonging to the user.',
  parameters: {
    protocolID: 'Specify an identifier for the protocol under which this operation is being performed.',
    keyID: 'An identifier for the message being encrypted. When decrypting, the same message ID will be required. This can be used to prevent key re-use, even when the same two users are using the same protocol to encrypt multiple messages. It can be randomly-generated, sequential, or even fixed.',
    description: 'Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.',
    counterparty: 'If specified, the user with this identity key will also be able to decrypt the message, as long as they specify the current user\'s identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone". (optional, default self)',
    privileged: 'When true, the data will be encrypted with the user\'s privileged keyring instead of their primary keyring. (optional, default false)',
    returnType: 'Specify the data type for the returned ciphertext. Available types are string (binary) and Uint8Array. (optional, default Uint8Array)'
  },
  body: {
    primaryParameter: 'data to encrypt.'
  },
  exampleResponse: {
    returnTypeOfString: {
      data: {
        status: 'success',
        result: 'Encrypted data returned as a base64 string'
      }
    },
    returnTypeOfUint8Array: {
      data: 'Encrypted data as a Uint8Array buffer'
    }
  },
  func: async (req, res) => {
    try {
      let data = req.body
      if (data.constructor === Buffer) {
        data = Uint8Array.from(data)
      } else if (data.constructor !== Uint8Array) {
        const e = new Error('Data to encrypt must be formatted as a buffer!')
        e.code = 'ERR_INVALID_REQUEST_BODY'
        throw e
      }
      const result = await CWI.encrypt({
        ...req.query,
        plaintext: data,
        originator: req.originator
      })
      if (typeof result === 'string') {
        res.status(200).json({
          status: 'success',
          result
        })
      } else if (result.constructor === Uint8Array) {
        // Send the data as a buffer
        res.setHeader('content-type', 'application/octet-stream')
        res.write(result, 'binary')
        res.end(null, 'binary')
      } else {
        throw new Error('Unexpected return type of ' + result.constructor)
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
const decryptData = {
  type: 'post',
  path: '/decrypt',
  summary: 'Decrypts data with a key belonging to the user.',
  parameters: {
    protocolID: 'Specify an identifier for the protocol under which this operation is being performed. It should be the same protocol ID used during encryption.',
    keyID: 'This should be the same message ID used during encryption.',
    description: 'Describe the high-level operation being performed, so that the user can make an informed decision if permission is needed.',
    counterparty: 'If specified, the user with this identity key will also be able to decrypt the message, as long as they specify the current user\'s identity key as their counterparty. Must be a hexadecimal string representing a 33-byte or 65-byte value, "self" or "anyone". (optional, default self)',
    privileged: 'This indicates which keyring should be used when decrypting. Use the same value as was used during encryption. (optional, default false)',
    returnType: 'Specify the data type for the returned plaintext. Available types are string (binary) and Uint8Array. (optional, default Uint8Array)'
  },
  body: {
    primaryParameter: 'the encrypted data to decipher.'
  },
  exampleResponse: {
    returnTypeOfString: {
      data: {
        status: 'success',
        result: 'Decrypted data as a string'
      }
    },
    returnTypeOfUint8Array: {
      data: 'Decrypted data as a Uint8Array buffer'
    }
  },
  func: async (req, res) => {
    try {
      let data = req.body
      if (req.body.constructor === Buffer) {
        data = Uint8Array.from(req.body)
      } else if (data.constructor !== Uint8Array) {
        const e = new Error('Data to decrypt must be formatted as a buffer!')
        e.code = 'ERR_INVALID_REQUEST_BODY'
        throw e
      }
      const result = await CWI.decrypt({
        ...req.query,
        ciphertext: data,
        originator: req.originator
      })
      if (typeof (result) === 'string') {
        res.status(200).json({
          status: 'success',
          result
        })
      } else if (result.constructor === Uint8Array) {
        // Send the data as a buffer
        res.setHeader('content-type', 'application/octet-stream')
        res.write(result, 'binary')
        res.end(null, 'binary')
      } else {
        throw new Error('Unexpected return type of ' + result.constructor)
      }
    } catch (e) {
      res.status(400).json({
        status: 'error',
        code: e.code || 'ERR_INTERNAL',
        description: e.message
      })
    }
  }
}
module.exports = { encryptData, decryptData }
