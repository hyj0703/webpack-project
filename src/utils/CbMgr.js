/**
 * @module CbMgr
 * @version 0.0.0
 */

/**
 * “回调管理”类
 * @class module:CbMgr~CbMgr
 */
export default class {
  /**
   * 构造函数
   */
  constructor() {
    this.cbsSet = {} //回调组成的对象
  }

  /**
   * 绑定回调
   * @param {String} type - 回调类型
   * @param {Function} [cb] - 回调
   */
  on(type, cb) {
    if (cb) {
      const cbs = (this.cbsSet[type] = this.cbsSet[type] || [])
      cbs.push(cb)
    }
    return this
  }

  /**
   * 解绑回调
   * @param {String | null} [type = null] - 回调类型（若为null，则删除所有回调）
   * @param {Function | null} [cb = null] - 回调（若为null，则删除所有该回调类型下的回调）
   */
  off(type = null, cb = null) {
    if (type) {
      const cbsSet = this.cbsSet
      const cbs = cbsSet[type]
      if (cbs) {
        if (cb) {
          const idx = cbs.indexOf(cb)
          if (~idx) {
            cbs.splice(idx, 1)
          }
        } else {
          delete cbsSet[type]
        }
      }
    } else {
      this.cbsSet = {}
    }
    return this
  }

  /**
   * 调用回调
   * @param {String} type - 回调类型
   * @param {...*} args - 要传递给回调的参数
   */
  call(type, ...args) {
    ;(this.cbsSet[type] || []).forEach((cb) => cb.apply(this, args))
    return this
  }

  /**
   * 添加回调相关方法
   * @param {String[]} types - 要添加的回调类型组成的数组
   */
  static addCb(types) {
    const { prototype } = this
    types.forEach((type) => {
      const cType = type.replace(/^./, (initial) => initial.toUpperCase()) //首字母大写的type
      prototype[`on${cType}`] = function (cb) {
        return this.on(type, cb)
      }
      prototype[`off${cType}`] = function (cb) {
        return this.off(type, cb)
      }

      /**
       * 调用回调
       * @param {...*} args - 要传递给回调的参数
       */
      prototype[`call${cType}`] = function (...args) {
        return this.call(type, ...args)
      }
    })
  }
}
