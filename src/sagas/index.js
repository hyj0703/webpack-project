import { all, call, takeEvery } from 'redux-saga/effects'
import actions from '../actions'

export default function* () {
  const effects = []
  for (let stateName in actions) {
    const { sagas } = actions[stateName] || {}
    for (let type in sagas) {
      effects.push(
        yield takeEvery(type, function* (action) {
          const { type, _resolve, _reject } = action
          const { [type]: saga } = sagas
          try {
            const ret = saga ? yield call(saga, action) : undefined
            if (_resolve) {
              _resolve(ret)
            }
          } catch (e) {
            if (_reject) {
              _reject(e)
            } else {
              throw e
            }
          }
          delete action._resolve
          delete action._reject
        })
      )
    }
  }
  yield all(effects)
}
