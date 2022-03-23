/**
 * @module domSelect
 * @version 0.0.0
 *
 * @example
 * 获取id为XXX的dom
 byId('XXX');
 *
 * @example
 * 从domA开始，获取最先匹配选择器'selector'的自身或祖先元素
 closest(domA,'selector');
 *
 * @example
 * 在上个例子的基础上只遍历到domB（包含domB）
 closest(domA,'selector',domB);
 */

/**
 * 根据id获取dom
 * @param {String} id - id
 * @returns {HTMLElement} 获取到的dom
 */
export function byId(id) {
  return document.getElementById(id)
}

const DOM_ROOT = document.documentElement
const matches =
  DOM_ROOT.matches || DOM_ROOT.webkitMatchesSelector || DOM_ROOT.matchesSelector

/**
 * 获取最先匹配选择器的自身或祖先元素
 * @param {HTMLElement} dom - 从这个dom开始匹配
 * @param {String} selector - 选择器
 * @param {HTMLElement} [context] - 只在这个dom中匹配（包含这个dom）
 * @returns {HTMLElement | null} 匹配到的元素（若未匹配到，则返回null）
 */
export function closest(dom, selector, context) {
  let domCur = dom //当前遍历到的dom
  let ret = null
  while (domCur) {
    if (matches.call(domCur, selector)) {
      ret = domCur
      break
    }
    if (domCur === context || domCur === DOM_ROOT) {
      break
    }
    domCur = domCur.parentNode
  }
  return ret
}
