import { compareJdVersion } from '@jmdd/jmdd-versions'
import {
  setInitCore,
  setIsEnabledCore,
  setIsVisibleCore,
  setOffChangeCore,
  setOnChangeCore,
} from '@jmdd/jmdd-visible-by-jd'
import isJr from '../isJr'

let adapted = !isJr() //是否已适配

/**
 * 适配
 * @returns 适配完成
 */
export default function adapt() {
  if (!adapted) {
    adapted = true
    if (isJr()) {
      setInitCore(initCore)
      setIsEnabledCore(isEnabledCore)
      setIsVisibleCore(isVisibleCore)
      setOnChangeCore(onChangeCore)
      setOffChangeCore(offChangeCore)
    }
  }
}

let inited = false //是否已初始化过
let enabled = null //页面可见性api是否可用（若尚未判断或无法判断时，为null）
let visible = null //页面是否可见（若尚未判断或无法判断时，为null）
const onChangeCbs = [] //“当页面可见性变化时的回调”组成的数组

/**
 * 在金融环境的init核心
 */
function initCore() {
  if (!inited) {
    inited = true
    enabled = compareJdVersion('5.3.40')
    if (enabled) {
      visible = true
      JrBridge.callNative({ type: '43' }, ({ type }) => {
        if (type === 43) {
          if (!visible) {
            visible = true
            onChangeCbs.slice().forEach((cb) => cb(true))
          }
        }
      })
    }
  }
}

/**
 * 在金融环境的isEnabled核心
 */
function isEnabledCore() {
  initCore()
  return enabled
}

/**
 * 在金融环境的isVisible核心
 */
function isVisibleCore() {
  initCore()
  return visible
}

/**
 * 在金融环境的onChange核心
 * @param {module:jmddVisibleByJd~onChange} cb - 要绑定的“当页面可见性变化时的回调”
 */
function onChangeCore(cb) {
  initCore()
  if (enabled && cb) {
    onChangeCbs.push(cb)
  }
}

/**
 * 在金融环境的offChange核心
 * @param {module:jmddVisibleByJd~onChange} cb - 要解绑的“当页面可见性变化时的回调”
 */
function offChangeCore(cb) {
  initCore()
  if (enabled && cb) {
    const idx = onChangeCbs.indexOf(cb)
    if (~idx) {
      onChangeCbs.splice(idx, 1)
    }
  }
}

/**
 * 在金融环境不可见时需调用
 */
export function invisible() {
  initCore()
  if (enabled) {
    if (visible) {
      visible = false
      onChangeCbs.slice().forEach((cb) => cb(false))
    }
  }
}

if (isJr()) {
  initCore()
}
