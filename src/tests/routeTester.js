const axios = require('axios')
const fetch =
  typeof window === 'object'
    ? window.fetch
    : require('isomorphic-fetch')
// Mock BabbageSDK Functions
// 1. Spin up node terminal
// 2. Import routeTester
// 3. Ex. call: await routeTester.createHmac(Buffer.from('data to hmac'))
// 4. Grant Babbage Desktop request
// 5. View console log results

const getVersion = async () => {
  const result = await fetch(
    'http://localhost:3301/v1/version',
    {
      method: 'GET',
      headers: {
        Origin: 'http://localhost',
        'Content-Type': 'application/json'
      }
    }
  )
  return result.json()
}

const createAction = async () => {
  const result = await fetch(
    'http://localhost:3301/v1/createAction',
    {
      method: 'POST',
      headers: {
        Origin: 'http://localhost',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: 'Testing an action!',
        outputs: [{ script: '006a', satoshis: 1 }]
      })
    }
  )
  return result.json()
}

const createHmac = async (dataToHmac) => {
  const result = await axios.post(
    'http://localhost:3301/v1/createHmac?protocolID=Hello%20World&keyID=1',
    dataToHmac,
    {
      headers: {
        Origin: 'http://localhost',
        'Content-Type': 'application/octet-stream'
      },
      responseType: 'arraybuffer'
    })
  return result
}
const verifyHmac = async (dataToVerify, hmac) => {
  const result = await axios.post(
    `http://localhost:3301/v1/verifyHmac?protocolID=Hello%20World&keyID=1&hmac=${hmac}`,
    dataToVerify,
    {
      headers: {
        Origin: 'http://localhost',
        // 'Content-Type': 'application/json' // Note: how do we want to handle the wrong content type error?
        'Content-Type': 'application/octet-stream'
      },
      responseType: 'json'
    })
  return result
}
const encrypt = async (dataToEncrypt, encryptReturnType = 'Uint8Array') => {
  // Encryption / Decryption Tests
  const result = await axios.post(
    `http://localhost:3301/v1/encrypt?protocolID=Hello%20World&keyID=1&returnType=${encryptReturnType}`,
    dataToEncrypt,
    {
      headers: {
        Origin: 'http://localhost',
        'Content-Type': 'application/octet-stream'
      },
      responseType: encryptReturnType === 'Uint8Array' ? 'arraybuffer' : 'json'
    }
  ).catch((error) => {
    console.log(error.message)
  })
  return result
}
const decrypt = async (dataToDecrypt, decryptReturnType = 'string') => {
  const result = await axios.post(
    `http://localhost:3301/v1/decrypt?protocolID=Hello%20World&keyID=1&returnType=${decryptReturnType}`,
    dataToDecrypt,
    {
      headers: {
        Origin: 'http://localhost',
        'Content-Type': 'application/octet-stream'
      },
      responseType: decryptReturnType === 'Uint8Array' ? 'arraybuffer' : 'json'
    })
  return result
}
const createSignature = async () => {
  // Encryption / Decryption Tests
  const result = await axios.post(
    'http://localhost:3301/v1/createSignature?protocolID=Hello%20World&keyID=1',
    Buffer.from('some data'),
    {
      headers: {
        Origin: 'http://localhost',
        'Content-Type': 'application/octet-stream'
      },
      responseType: 'arraybuffer'
    }
  ).catch((error) => {
    console.log(error.message)
  })
  return result
}
const verifySignature = async (signature) => {
  // Encryption / Decryption Tests
  const result = await axios.post(
    `http://localhost:3301/v1/verifySignature?signature=${encodeURIComponent(signature)}&protocolID=Hello%20World&keyID=1`,
    Buffer.from('some data'),
    {
      headers: {
        Origin: 'http://localhost',
        'Content-Type': 'application/octet-stream'
      },
      responseType: 'json'
    }
  ).catch((error) => {
    console.log(error.message)
  })
  return result
}

module.exports = { createHmac, verifyHmac, encrypt, decrypt, createSignature, verifySignature, getVersion, createAction }