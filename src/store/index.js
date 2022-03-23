import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import reducer from '../reducers'
import saga from '../sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(saga)

export default store

/**
 * dispatch
 * @param {Object} action - action
 * @returns {Object} action
 */
export function dispatch(action) {
  return store.dispatch(action)
}

/**
 * 能返回promise的dispatch
 * @param {Object} action - action
 * @returns {Promise} promise
 */
export function promiseDispatch(action) {
  return new Promise((resolve, reject) => {
    action._resolve = resolve
    action._reject = reject
    store.dispatch(action)
  })
}

/**
 * 使得mapDispatchToProps的dispatch能返回promise
 * @param {Function} mapDispatchToProps - mapDispatchToProps
 * @returns {Function} dispatch能返回promise的mapDispatchToProps
 */
export function withPromise(mapDispatchToProps) {
  return (dispatch, ownProps) => mapDispatchToProps(promiseDispatch, ownProps)
}
