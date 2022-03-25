import { call, put } from 'redux-saga/effects'
import functionId from '@jmdd/jmdd-service-function-id'

export default {
  name: 'pk',
}

export function SET_PK_STATE_DATA(state = {}, { payload }) {
  return { ...state, ...payload }
}

export function* GET_PK_INIT_DATA(payload) {
  try {
    const {
      code,
      msg,
      data: { bizCode, bizMsg, result },
    } = yield call(functionId, {
      functionId: 'tigernian_pk_getHomeData',
    })
    if (code === 0 && bizCode === 0) {
      yield put({
        type: SET_PK_STATE_DATA.type,
        payload: { ...result },
      })
    }
  } catch (e) {
    console.log('error', e)
  }
}
