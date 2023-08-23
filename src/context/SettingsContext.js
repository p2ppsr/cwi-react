
import React, { createContext, useEffect, useState } from 'react'
import { get, set } from 'babbage-kvstore'
import confederacyHost from '../utils/confederacyHost'
import { encrypt, decrypt } from '@babbage/sdk'

const SettingsContext = createContext()
const PROTOCOL_ID = 'cwi settings'

const SettingsProvider = ({ children }) => {
  // Theme settings
  const [settings, setSettings] = useState({ theme: 'light' })
  const confederacyHostURL = confederacyHost()

  const updateSettings = async (newSettings = {}) => {
    try {
      const mergedSettings = { ...settings, ...newSettings }
      setSettings(mergedSettings)

      // Encrypt the settings data
      const encryptedSettings = await encrypt({
        plaintext: Buffer.from(JSON.stringify(mergedSettings)),
        protocolID: [2, PROTOCOL_ID],
        keyID: '1',
        counterparty: 'self',
        returnType: 'string'
      })

      console.log(confederacyHostURL)

      await set(Buffer.from('MetaNetClientSettings').toString('base64'), encryptedSettings, { confederacyHost: confederacyHostURL, protocolID: PROTOCOL_ID })
    } catch (error) {
      throw error
      // console.error(error)
    }
  }

  const contextValue = {
    settings,
    updateSettings
  }

  useEffect(() => {
    const getSettings = async () => {
      try {
        // Check for saved settings
        const savedSettings = await get(Buffer.from('MetaNetClientSettings').toString('base64'), undefined, { confederacyHost: confederacyHostURL, protocolID: PROTOCOL_ID })

        if (!savedSettings) return

        // Decrypt user settings using cwi settings protocol!
        const decryptedSettings = await decrypt({
          ciphertext: savedSettings,
          protocolID: [2, PROTOCOL_ID],
          keyID: '1',
          counterparty: 'self',
          returnType: 'string'
        })

        // Load any saved settings
        if (decryptedSettings) {
          setSettings(JSON.parse(decryptedSettings))
        }
      } catch (error) {
        console.error(error)
      }
    }
    getSettings()
  }, [])

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsProvider, SettingsContext }
