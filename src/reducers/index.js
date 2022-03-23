import { combineReducers } from 'redux'
import actions from '../actions'

const reducersToCombine = {}

for (let stateName in actions) {
  const { reducers, def } = actions[stateName] || {}
  if (reducers) {
    reducersToCombine[stateName] = (state = def, action) => {
      const { type, _resolve } = action
      const { [type]: reducer } = reducers
      if (reducer) {
        if (_resolve) {
          _resolve()
        }
        delete action._resolve
        delete action._reject
        return reducer(state, action)
      } else {
        return state
      }
    }
  }
}

export default combineReducers(reducersToCombine)
