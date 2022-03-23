/**
 * @module event
 * @version 0.0.0
 */

import KeysMap from './KeysMap'
import { closest } from './select'
import { find } from './touch'

const TAP_THRESHOLD = 10 //tap的阈值（单位：像素）
const TAP_THRESHOLD_SQUARE = TAP_THRESHOLD * TAP_THRESHOLD //TAP_THRESHOLD的平方

const keysMap = new KeysMap() //事件处理函数映射

/**
 * 绑定事件
 * @param {HTMLElement | Window} dom - 要绑定事件的dom
 * @param {String} type - 要绑定的事件
 * @param {String} selector - 选择器
 * @param {Function} handler - 处理函数
 * @param {String} [_selectorForKeysMap = selector] - 用于区别选择器的映射的key
 * @param {Function} [_handlerForKeysMap = handler] - 用于区别处理函数的映射的key
 */
export function on(
  dom,
  type,
  selector,
  handler,
  _selectorForKeysMap,
  _handlerForKeysMap
) {
  if (typeof selector === 'function') {
    _handlerForKeysMap = _selectorForKeysMap
    _selectorForKeysMap = handler
    handler = selector
    selector = null
  }
  _selectorForKeysMap =
    typeof _selectorForKeysMap === 'undefined' ? selector : _selectorForKeysMap
  _handlerForKeysMap =
    typeof _handlerForKeysMap === 'undefined' ? handler : _handlerForKeysMap
  if (handler) {
    if (selector) {
      on(
        dom,
        type,
        (...args) => {
          const [{ target }] = args
          const domClosest = closest(target, selector, dom)
          if (domClosest) {
            handler.apply(domClosest, args)
          }
        },
        _selectorForKeysMap,
        _handlerForKeysMap
      )
    } else {
      switch (type) {
        case 'tap':
          let tapStartX = NaN
          let tapStartY = NaN
          let tapStartId = NaN
          on(
            dom,
            'touchstart',
            keysMap.add(
              ['tapStart', _selectorForKeysMap, _handlerForKeysMap],
              ({ changedTouches: [{ pageX, pageY, identifier }] }) => {
                tapStartX = pageX
                tapStartY = pageY
                tapStartId = identifier
              }
            )
          )
          on(
            dom,
            'touchend',
            keysMap.add(
              ['tapEnd', _selectorForKeysMap, _handlerForKeysMap],
              function (...args) {
                const [{ changedTouches }] = args
                const touch = find(changedTouches, {
                  identifier: tapStartId,
                })
                if (touch) {
                  const { pageX, pageY } = touch
                  const dx = pageX - tapStartX
                  const dy = pageY - tapStartY
                  if (dx * dx + dy * dy < TAP_THRESHOLD_SQUARE) {
                    handler.apply(this, args)
                  }
                  tapStartX = NaN
                  tapStartY = NaN
                  tapStartId = NaN
                }
              }
            )
          )
          on(
            dom,
            'touchcancel',
            keysMap.add(
              ['tapCancel', _selectorForKeysMap, _handlerForKeysMap],
              () => {
                tapStartX = NaN
                tapStartY = NaN
                tapStartId = NaN
              }
            )
          )
          break
        default:
          dom.addEventListener(
            type,
            keysMap.add(
              [type, _selectorForKeysMap, _handlerForKeysMap],
              handler
            )
          )
      }
    }
  }
}

/**
 * 解绑事件
 * @param {HTMLElement} dom - 要绑定事件的dom
 * @param {String} type - 要解绑的事件
 * @param {String} selector - 选择器
 * @param {Function} handler - 处理函数
 */
export function off(dom, type, selector, handler) {
  if (handler) {
    switch (type) {
      case 'tap':
        off(dom, 'touchstart', keysMap.del(['tapStart', selector, handler]))
        off(dom, 'touchend', keysMap.del(['tapEnd', selector, handler]))
        off(dom, 'touchcancel', keysMap.del(['tapCancel', selector, handler]))
        break
      default:
        dom.removeEventListener(type, keysMap.del([type, selector, handler]))
    }
  }
}

/**
 * 绑定tap事件
 * @param {HTMLElement} dom - 要绑定事件的dom
 * @param {String} selector - 选择器
 * @param {Function} handler - 处理函数
 */
export function tap(dom, selector, handler) {
  return on(dom, 'tap', selector, handler)
}
