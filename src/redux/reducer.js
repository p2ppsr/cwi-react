import { UPDATE } from './types'

export const initialState = {
  routes: {
    Greeter: '/',
    Recovery: '/recovery',
    RecoveryLostPassword: '/recovery/lost-password',
    RecoveryLostPhone: '/recovery/lost-phone',
    Settings: '/cwi-settings',
    PhoneSettings: '/cwi-settings/phone',
    PasswordSettings: '/cwi-settings/password',
    RecoveryKeySettings: '/cwi-settings/recovery-key'
  },
  mainPage: '/dashboard',
  logoURL: undefined
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default reducer
