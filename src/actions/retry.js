import {
  getPageLoadingCount,
  hidePageLoading,
  offHidePageLoading,
  onHidePageLoading,
  showPageLoading,
} from '@jmdd/jmdd-page-loading'
import functionId from '@jmdd/jmdd-service-function-id'
import toast from '@jmdd/jmdd-toast'
import { all, call, put, select } from '@redux-saga/core/effects'

/**
 * 跳过重试的错误对象
 * 在重试时throw该对象会停止重试，并使得RETRY_CALL返回的promise触发reject，reject的参数为该类构造函数的入参
 * @class
 */
export class RetrySkipErr {
  /**
   * 构造函数
   * @constructor
   * @param {*} [err] - throw该对象后，RETRY_CALL返回的promise抛出的错误
   */
  constructor(err) {
    this.err = err
  }
}

export default {
  inRetry: false, //是否已进入重试页
  cbInfos: [], //重试函数信息组成的数组
  checkFunctionId: null, //检测functionId结果的函数
}

/**
 * 设置
 */
export function RETRY_SET_DATA(state, { payload }) {
  return { ...state, ...payload }
}

/**
 * 调用回调，若失败则跳转到重试页，直至在重试页重试成功，本函数返回的promise才会resolve
 */
export function* RETRY_CALL({
  payload: {
    requirePageLoading = true, //是否需要显示pageLoading
    skipRetry = false, //是否出错后跳过重试（可能的值：true-跳过重试；false-不跳过重试；'toast'-跳过重试，并显示toast）
    throwError = true, //是否抛出错误
    cb, //要调用的回调
    args = [], //要调用回调的参数
  },
}) {
  let ret
  let err
  if (requirePageLoading) {
    showPageLoading()
  }
  try {
    ret = yield call(cb, ...args)
  } catch (e) {
    console.error(e)
    if (e instanceof RetrySkipErr) {
      if (throwError) {
        err = e.err
      }
    } else if (skipRetry) {
      if (skipRetry === 'toast') {
        toast({ txt: e, icon: 'fail' })
      }
      if (throwError) {
        err = e
      }
    } else {
      let pageLoadingCount = getPageLoadingCount()

      /**
       * 当hidePageLoading被调用时的处理函数
       */
      function onHidePageLoadingCb() {
        pageLoadingCount--
      }

      //start:进入重试页前隐藏所有pageLoading
      if (pageLoadingCount) {
        hidePageLoading(true)
        onHidePageLoading(onHidePageLoadingCb)
      }
      //end:进入重试页前隐藏所有pageLoading

      //start:进入重试页
      const { cbInfos } = yield select(({ retry }) => retry)
      let resolve
      let reject
      const promise = new Promise((tmpResolve, tmpReject) => {
        resolve = tmpResolve
        reject = tmpReject
      })
      yield put({
        type: RETRY_SET_DATA.type,
        payload: {
          inRetry: true,
          cbInfos: [
            ...cbInfos,
            {
              cb, //原始cb
              args, //cb的参数
              isSuc: false, //cb是否调用成功
              ret: null, //cb的返回值
              resolve, //RETRY_CALL的返回值promise的resolve
              reject, //RETRY_CALL的返回值promise的reject
            },
          ],
        },
      })
      //end:进入重试页

      let retryRet
      let retryErr
      try {
        retryRet = yield call(() => promise) //等待重试页重试成功后再继续执行
      } catch (e) {
        console.error(e)
        if (e instanceof RetrySkipErr) {
          if (throwError) {
            retryErr = e.err
          }
        }
      }

      //start:离开重试页后恢复之前隐藏的所有pageLoading
      offHidePageLoading(onHidePageLoadingCb)
      for (let i = 0, len = pageLoadingCount; i < len; i++) {
        showPageLoading()
      }
      //end:离开重试页后恢复之前隐藏的所有pageLoading

      if (retryRet) {
        ret = retryRet
      } else if (retryErr) {
        err = retryErr
      }
    }
  }
  if (requirePageLoading) {
    hidePageLoading()
  }
  if (ret) {
    return ret
  } else if (err) {
    throw err
  }
}

/**
 * 重试
 */
export function* RETRY_RETRY() {
  const { cbInfos } = yield select(({ retry }) => retry)
  const rets = [] //调用结果
  let err = null //错误
  let isAllSuc = true //是否全部调用成功

  showPageLoading()

  //同时调用所有重试函数
  //若部分重试函数成功，则在之后的重试中不再调用，并记录本次重试的返回值，作为最终的返回值
  //因此所有的重试函数只会被成功调用1次
  yield all(
    cbInfos
      .filter(({ isSuc }) => !isSuc)
      .map((cbInfo) =>
        call(function* () {
          const { cb, args, reject } = cbInfo
          try {
            const cbInfoRet = yield call(cb, ...args)
            cbInfo.ret = cbInfoRet
            cbInfo.isSuc = true
            rets.push(cbInfoRet)
          } catch (e) {
            if (e instanceof RetrySkipErr) {
              const idx = cbInfos.indexOf(cbInfo)
              if (~idx) {
                cbInfos.splice(idx, 1)
              }
              reject(e)
            } else {
              if (!err) {
                err = e
              }
              isAllSuc = false
            }
          }
        })
      )
  )

  hidePageLoading()

  //所有重试函数均调用成功后，才让RETRY_CALL返回的promise继续执行
  //同时清除当前store中记录的所有重试函数
  if (isAllSuc) {
    cbInfos.forEach(({ resolve, ret }) => resolve(ret))
    yield put({
      type: RETRY_SET_DATA.type,
      payload: {
        inRetry: false,
        cbInfos: [],
      },
    })

    //所有重试函数均调用成功后会返回这些重试函数的返回值组成的数组
    return rets
  } else {
    //部分重试函数调用失败后会抛出“这些重试函数的首个错误”作为错误
    throw err
  }
}

/**
 * 调用带重试方法的functionId
 */
export function* RETRY_FUNCTION_ID({
  payload: {
    handler = null, //functionId返回数据的处理函数，在该函数中出错也会触发重试，支持generator、async函数
    requirePageLoading = true, //是否需要显示pageLoading
    skipRetry = false, //是否出错后跳过重试（可能的值：true-跳过重试；false-不跳过重试；'toast'-跳过重试，并显示toast）
    requireCheck = true, //是否需要检测functionId的返回数据
    throwError = true, //是否抛出错误
    ...functionIdOpts
  },
}) {
  let hiddenPageLoading = true //是否已经隐藏pageLoading
  try {
    if (requirePageLoading) {
      showPageLoading()
    }
    hiddenPageLoading = false
    return yield call(RETRY_CALL, {
      payload: {
        cb: function* () {
          let ret
          try {
            ret = yield call(functionId, functionIdOpts)
          } catch (e) {
            throw '请求失败'
          }
          if (requireCheck) {
            const { checkFunctionId } = yield select(({ retry }) => retry)
            if (checkFunctionId) {
              yield call(checkFunctionId, ret, functionIdOpts)
            }
          }
          if (requirePageLoading) {
            hiddenPageLoading = true
            hidePageLoading()
          }
          if (handler) {
            return yield call(handler, ret, functionIdOpts)
          }
          return ret
        },
        requirePageLoading: false,
        skipRetry,
        throwError,
      },
    })
  } catch (e) {
    if (!hiddenPageLoading) {
      hidePageLoading()
    }
    throw e
  }
}

/**
 * 设置检测functionId返回数据的函数
 */
export function RETRY_SET_CHECK_FUNCTION_ID(
  state,
  { payload: { checkFunctionId } }
) {
  return { ...state, checkFunctionId }
}
