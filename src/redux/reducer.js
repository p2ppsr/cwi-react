import { UPDATE } from './types'

export const initialState = {
  routes: {
    Greeter: '/',
    Recovery: '/recovery',
    CWISettings: '/cwi-settings'
  },
  mainPage: '/dashboard',
  appName: 'Example App',
  appLogo: undefined
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
