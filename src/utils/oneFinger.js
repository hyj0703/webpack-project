/**
 * @module oneFinger
 * @version 0.0.0
 *
 * @example
 * 在元素domA上绑定1根手指的操作，回调onStart、onMove、onEnd、onCancel只会响应第1根触摸屏幕的手指的操作，其他手指操作无效
 on({
        dom: domA,
        onStart() {
            console.log('touchstart');
        },
        onMove() {
            console.log('touchmove');
        },
        onEnd() {
            console.log('touchend');
        },
        onCancel() {
            console.log('touchcancel');
        }
    }); //return oneFingerId;
 *
 * @example
 * 解绑
 off(oneFingerId); //oneFingerId为oneFinger方法的返回值
 */

import { off as offEvent, on as onEvent } from './event'
import genId from './genId'
import { find, findIdx, isFirstTouchStart } from './touch'

const binders = {} //绑定的数据

/**
 * 封装的事件
 * @typedef {Object} module:oneFinger~event
 * @property {Touch} touch - 绑定的touch
 * @property {Number | null} speedX - x方向上的速度（若不需要计算速度，则为null）
 * @property {Number | null} speedY - y方向上的速度（若不需要计算速度，则为null）
 * @property {Event} e - 原始事件
 */

/**
 * oneFinger的回调
 * @callback module:oneFinger~cb
 * @this {HTMLElement} 绑定的dom
 * @param {module:oneFinger~event} e - 封装的事件
 */

/**
 * 绑定
 * @param {Object} opts - 参数
 *    @param {HTMLElement} opts.dom - dom
 *    @param {module:oneFinger~cb} [opts.onStart] - ontouchstart
 *    @param {module:oneFinger~cb} [opts.onMove] - ontouchmove
 *    @param {module:oneFinger~cb} [opts.onEnd] - ontouchend
 *    @param {module:oneFinger~cb} [opts.onCancel] - ontouchcancel
 *    @param {Boolean} [opts.needSpeed = false] - 是否需要计算速度
 *    @param {Number} [opts.speedDataNum = 5] - 计算速度时的数据数量
 *    @param {Boolean} [opts.inOrder = true] - 是否按顺序（若不按顺序，则当第1根手指释放后，仅当屏幕上的所有手指离开后，才能重新出发onStart。若按顺序，则当第1根手指释放后，则以第2根手指作为是否触发事件的判断依据；当第2根手指释放后，则以第3根手指作为判断依据...）
 * @returns {Number} id
 */
export function on({
  dom,
  onStart: rawOnStart,
  onMove: rawOnMove,
  onEnd: rawOnEnd,
  onCancel: rawOnCancel,
  needSpeed = false,
  speedDataNum = 5,
  inOrder = true,
}) {
  const id = genId()
  let touchesInOrder = [] //touch按触摸屏幕的顺序组成的数组
  let touchInCharge = null //作为依据的touch
  let touchCachesSet //最后触发touch事件数据的缓存

  /**
   * 添加touchesInOrder
   * @param {TouchList} touches - 要添加的touch的touchList
   */
  function addTouchesInOrder(touches) {
    touchesInOrder.push(...Array.from(touches))
  }

  /**
   * 删除touchesInOrder
   * @param {TouchList} touches - 要删除的touch的touchList
   */
  function removeTouchesInOrder(touches) {
    Array.from(touches).forEach((touch) => {
      const idx = findIdx(touchesInOrder, touch)
      if (~idx) {
        touchesInOrder.splice(idx, 1)
      }
    })
  }

  /**
   * 添加touchCaches
   * @param {TouchList} touches - 要添加的touch的touchList
   */
  function addTouchCaches(touches) {
    if (needSpeed) {
      Array.from(touches).forEach(({ identifier, pageX, pageY }) => {
        const touchCaches = (touchCachesSet[identifier] =
          touchCachesSet[identifier] || [])
        const time = new Date()
        touchCaches.push({
          pageX,
          pageY,
          time,
        })
        if (touchCaches.length > speedDataNum) {
          touchCaches.shift()
        }
      })
    }
  }

  /**
   * 速度
   * @typedef {Object} module:oneFinger~speed
   * @property {Number} x - x速度
   * @property {Number} y - y速度
   */

  /**
   * 设置封装的事件的速度
   * @param {module:oneFinger~event} e - 封装的事件
   * @returns {module:oneFinger~speed} 速度
   */
  function setSpeed(e) {
    if (needSpeed) {
      const {
        touch: { identifier },
      } = e
      const {
        [identifier]: [
          { time: startTime, pageX: startPageX, pageY: startPageY },
          { time: endTime, pageX: endPageX, pageY: endPageY } = {},
        ],
      } = touchCachesSet
      const duration = startTime - endTime
      e.speedX = (startPageX - endPageX) / duration || 0
      e.speedY = (startPageY - endPageY) / duration || 0
    }
  }

  /**
   * touchstart处理函数
   */
  function onStart(rawE) {
    const { touches, changedTouches } = rawE

    //start:防止某些意料之外导致touchend没有触发的情况
    if (
      isFirstTouchStart({
        touches,
        changedTouches,
      })
    ) {
      touchesInOrder = []
      touchInCharge = null
      if (needSpeed) {
        touchCachesSet = {}
      }
    }
    //end:防止某些意料之外导致touchend没有触发的情况

    addTouchesInOrder(changedTouches)
    addTouchCaches(changedTouches)
    if (!touchInCharge) {
      const touch = changedTouches[0]
      touchInCharge = touch
      const e = {
        touch,
        speedX: null,
        speedY: null,
        e: rawE,
      } //封装的事件
      setSpeed(e)
      rawOnStart && rawOnStart.call(this, e)
    }
  }

  /**
   * touchmove处理函数
   */
  function onMove(rawE) {
    const { changedTouches } = rawE
    addTouchCaches(changedTouches)
    const touch = find(changedTouches, touchInCharge)
    if (touch) {
      const e = {
        touch,
        speedX: null,
        speedY: null,
        e: rawE,
      } //封装的事件
      setSpeed(e)
      rawOnMove && rawOnMove.call(this, e)
    }
  }

  /**
   * touchend处理函数
   */
  function onEnd(rawE) {
    const { changedTouches } = rawE
    removeTouchesInOrder(changedTouches)
    addTouchCaches(changedTouches)
    const touch = find(changedTouches, touchInCharge)
    if (touch) {
      touchInCharge = (inOrder && touchesInOrder[0]) || null
      const e = {
        touch,
        speedX: null,
        speedY: null,
        e: rawE,
      } //封装的事件
      setSpeed(e)
      if (needSpeed) {
        const { identifier } = touch
        delete touchCachesSet[identifier]
      }
      rawOnEnd && rawOnEnd.call(this, e)
    }
  }

  /**
   * touchcancel处理函数
   */
  function onCancel(rawE) {
    const { changedTouches } = rawE
    removeTouchesInOrder(changedTouches)
    addTouchCaches(changedTouches)
    const touch = find(changedTouches, touchInCharge)
    if (touch) {
      touchesInOrder.shift()
      touchInCharge = (inOrder && touchesInOrder[0]) || null
      const e = {
        touch,
        speedX: null,
        speedY: null,
        e: rawE,
      } //封装的事件
      setSpeed(e)
      if (needSpeed) {
        const { identifier } = touch
        delete touchCachesSet[identifier]
      }
      rawOnCancel && rawOnCancel.call(this, e)
    }
  }

  //start:绑定事件
  onEvent(dom, 'touchstart', null, onStart)
  onEvent(dom, 'touchmove', null, onMove)
  onEvent(dom, 'touchend', null, onEnd)
  onEvent(dom, 'touchcancel', null, onCancel)
  //end:绑定事件

  binders[id] = {
    dom,
    onStart,
    onMove,
    onEnd,
    onCancel,
  }
  return id
}

/**
 * 解绑
 * @param {Number} id - 绑定时返回的id
 */
export function off(id) {
  const binder = binders[id]
  if (binder) {
    const { dom, onStart, onMove, onEnd, onCancel } = binder

    //start:解绑事件
    offEvent(dom, 'touchstart', null, onStart)
    offEvent(dom, 'touchmove', null, onMove)
    offEvent(dom, 'touchend', null, onEnd)
    offEvent(dom, 'touchcancel', null, onCancel)
    //end:解绑事件

    delete binders[id]
  }
}
