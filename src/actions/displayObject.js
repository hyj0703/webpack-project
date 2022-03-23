import { call, put, select } from 'redux-saga/effects'

export default {
  displayObjects: {
    /**
     * 结构：
     *  [type]: { //类型（需唯一）
     *    props: props, //要传给显示对象组件的props
     *    resolve: resolve, //显示对象流程已结束的resolve
     *    promise: promise, //显示对象流程已结束的promise
     *    displayed: false, //显示对象是否显示
     *    ret: null, //隐藏显示对象时返回的结果
     *  }
     */
  }, //显示对象
}

/**
 * 设置
 */
export function DISPLAY_OBJECT_SET_DATA(state, { payload }) {
  return { ...state, ...payload }
}

/**
 * 设置某个显示对象
 */
export function DISPLAY_OBJECT_SET_ONE(state, { payload }) {
  const { displayObjects } = state
  return { ...state, displayObjects: { ...displayObjects, ...payload } }
}

/**
 * 删除某个显示对象
 */
export function DISPLAY_OBJECT_REMOVE_ONE(state, { payload: { type } }) {
  const {
    displayObjects: { [type]: displayObject, ...displayObjects },
  } = state
  return { ...state, displayObjects }
}

/**
 * 显示显示对象
 */
export function* DISPLAY_OBJECT_SHOW({ payload: props }) {
  const { type } = props
  const {
    displayObjects: { [type]: displayObject },
  } = yield select(({ displayObject }) => displayObject)
  let promise
  if (displayObject) {
    promise = displayObject.promise
  } else {
    let resolve
    promise = new Promise((tmpResolve) => (resolve = tmpResolve))
    yield put({
      type: DISPLAY_OBJECT_SET_ONE.type,
      payload: {
        [type]: {
          props,
          resolve,
          promise,
          displayed: true,
          ret: undefined,
        },
      },
    })
  }
  return yield call(() => promise)
}

/**
 * 隐藏显示对象
 */
export function* DISPLAY_OBJECT_HIDE({ payload: { type, ret } }) {
  const {
    displayObjects: { [type]: displayObject, ...otherDisplayObjects },
  } = yield select(({ displayObject }) => displayObject)
  let promise
  if (displayObject) {
    promise = displayObject.promise
    yield put({
      type: DISPLAY_OBJECT_SET_ONE.type,
      payload: {
        [type]: { ...displayObject, displayed: false, ret },
      },
    })
  }
  return yield call(() => promise)
}

/**
 * 结束显示对象流程
 */
export function* DISPLAY_OBJECT_END({ payload: { type } }) {
  const {
    displayObjects: { [type]: displayObject },
  } = yield select(({ displayObject }) => displayObject)
  if (displayObject) {
    yield put({
      type: DISPLAY_OBJECT_REMOVE_ONE.type,
      payload: { type },
    })
    const { ret, resolve, promise } = displayObject
    resolve(typeof ret === 'function' ? ret() : ret)
    return yield call(() => promise)
  }
}

/**
 * 显示对象是否显示
 */
export function* DISPLAY_OBJECT_IS_DISPLAYED({ payload: { type } }) {
  const { displayObjects } = yield select(({ displayObject }) => displayObject)
  return displayObjects?.[type]?.displayed || false
}

/**
 * 显示对象是否销毁
 */
export function* DISPLAY_OBJECT_IS_DESTROYED({ payload: { type } }) {
  const { displayObjects } = yield select(({ displayObject }) => displayObject)
  return !(type in displayObjects)
}
