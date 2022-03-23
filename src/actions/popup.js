import { call, put, select } from 'redux-saga/effects'

export default {
  popups: {
    /**
     * 结构：
     *  [type]: { //弹窗类型（需唯一）
     *    props: props, //要传给弹窗组件的props
     *    resolve: resolve, //弹窗流程已结束的resolve
     *    promise: promise, //弹窗流程已结束的promise
     *    shown: false, //弹窗是否显示
     *    ret: null, //隐藏弹窗时返回的结果
     *  }
     */
  }, //弹框
}

/**
 * 设置
 */
export function POPUP_SET_DATA(state, { payload }) {
  return { ...state, ...payload }
}

/**
 * 设置某个弹窗
 */
export function POPUP_SET_ONE(state, { payload }) {
  const { popups } = state
  return { ...state, popups: { ...popups, ...payload } }
}

/**
 * 删除某个弹窗
 */
export function POPUP_REMOVE_ONE(state, { payload: { type } }) {
  const {
    popups: { [type]: popup, ...popups },
  } = state
  return { ...state, popups }
}

/**
 * 显示弹窗
 */
export function* POPUP_SHOW({ payload: { type, ...payloadContentProps } }) {
  const {
    popups: { [type]: popup },
  } = yield select(({ popup }) => popup)
  let promise
  if (popup) {
    promise = popup.promise
  } else {
    let resolve
    promise = new Promise((tmpResolve) => (resolve = tmpResolve))
    yield put({
      type: POPUP_SET_ONE.type,
      payload: {
        [type]: {
          payloadContentProps,
          resolve,
          promise,
          shown: true,
          ret: undefined,
        },
      },
    })
  }
  return yield call(() => promise)
}

/**
 * 隐藏弹窗
 */
export function* POPUP_HIDE({ payload: { type, ret } }) {
  const {
    popups: { [type]: popup },
  } = yield select(({ popup }) => popup)
  let promise
  if (popup) {
    promise = popup.promise
    yield put({
      type: POPUP_SET_ONE.type,
      payload: {
        [type]: { ...popup, shown: false, ret },
      },
    })
  }
  return yield call(() => promise)
}

/**
 * 结束弹窗流程
 */
export function* POPUP_END({ payload: { type } }) {
  const {
    popups: { [type]: popup },
  } = yield select(({ popup }) => popup)
  if (popup) {
    yield put({
      type: POPUP_REMOVE_ONE.type,
      payload: { type },
    })
    const { ret, resolve, promise } = popup
    resolve(typeof ret === 'function' ? ret() : ret)
    return yield call(() => promise)
  }
}

/**
 * 弹窗是否显示
 */
export function* POPUP_IS_SHOWN({ payload: { type } }) {
  const { popups } = yield select(({ popup }) => popup)
  return popups?.[type]?.shown || false
}

/**
 * 弹窗是否全部隐藏
 */
export function* POPUP_IS_ALL_HIDDEN() {
  const { popups } = yield select(({ popup }) => popup)
  return !Object.values(popups).some(({ shown }) => shown)
}
