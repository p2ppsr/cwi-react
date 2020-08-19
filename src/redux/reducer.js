import { UPDATE } from './types'

export const initialState = {
  routes: {},
  mainPage: '/dashboard'
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
