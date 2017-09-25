import { Actions } from "../actions/type";
import { Store } from "../store";
import { combineReducers } from "redux";
import { routerReducer } from 'react-router-redux'

const initState: Store = {
  value: 0
}

export default function app(state = initState, action: Actions) {
  switch (action.type) {
    case 'INC':
      return { ...state, value: state.value + 1 }
    case 'DEC':
      return { ...state, value: state.value - 1 }
    default:
      return state
  }
}

export const reducer = combineReducers({
  app,
  routing: routerReducer
})