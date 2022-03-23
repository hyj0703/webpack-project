import { call, put } from 'redux-saga/effects'
import { RETRY_FUNCTION_ID } from './retry'

//state的默认值
export default {}

//定义reducer
export function DEMO_SET_DATA(state, { payload }) {
  return { ...state, ...payload }
}

//定义saga
export function* DEMO_GET_DATA() {
  return yield call(RETRY_FUNCTION_ID, {
    payload: {
      functionId: 'getDemoData',
      handler: function* ({ code, data: { bizCode, result, bizMsg } }) {
        console.log(code, bizCode, result, bizMsg)

        //handler中可以处理请求返回的数据，支持generator、async函数
        //在handler中出错，也会触发重试

        const { users } = result
        yield put({
          type: DEMO_SET_DATA.type,
          payload: { users },
        })

        //hander的返回值就是RETRY_FUNCTION_ID的返回值
        return users
      },
    },
  }) //hander的返回值就是RETRY_FUNCTION_ID的返回值
}
