/**
 * @module KeysMap
 * @version 0.0.0
 *
 * @example
 * 实例化多个key映射的map
 const keysMap = new KeysMap();
 *
 * @example
 * 在keysMapA中添加key0和key1映射的值valA，并返回valA
 const valA = keysMapA.add([key0,key1], valA);
 *
 * @example
 * 在keysMapA中添加key0和key1映射的值valA，并返回keysMapA
 const keysMapA = keysMapA.add([key0, key1], valA, false);
 *
 * @example
 * 在keysMapA中设置首个符合key0和key1映射的值valA，并返回valA
 const valA = keysMapA.set([key0, key1], valA); //set和add方法的区别在于：若key完全相同，set方法会修改映射的值；而add方法会添加一个相同key的新的映射
 *
 * @example
 * 在keysMapA中设置首个符合key0和key1映射的值valA，并返回keysMapA
 const keysMapA = keysMapA.set([key0, key1], valA, false);
 *
 * @example
 * 在keysMapA中获取首个符合key0和key1的映射
 const val = keysMapA.get([key0, key1]);
 *
 * @example
 * 在keysMapA中获取所有符合key0和key1的映射组成的数组
 const vals = keysMapA.gets([key0, key1]);
 *
 * @example
 * 在keysMapA中删除首个符合key0和key1的映射，并返回映射的值
 const val = keysMapA.del([key0, key1]);
 *
 * @example
 * 在keysMapA中删除首个符合key0和key1的映射，并返回keysMapA
 const keysMapA = keysMapA.del([key0, key1], false);
 *
 * @example
 * 在keysMapA中删除所有符合key0和key1的映射，并返回映射的值组成的数组
 const vals = keysMapA.dels([key0, key1]);
 *
 * @example
 * 在keysMapA中删除所有符合key0和key1的映射，并返回keysMapA
 const keysMapA = keysMapA.dels([key0, key1], false);
 */

/**
 * “多个key的映射”类
 * @class module:KeysMap~KeysMap
 */

export default class {
  /**
   * 构造函数
   */
  constructor() {
    this._datas = [] //keys和val组成的对象组成的数组
  }

  /**
   * 获取首个符合keys的索引
   * @param {*[]} keys - key组成的数组
   * @param {Number} [start = 0] - 起始检测的索引
   * @returns {Number} 索引（若未获取到，则返回-1）
   */
  _getIdx(keys, start = 0) {
    let ret = -1
    const _datas = this._datas
    let _data
    for (let i = start, len = _datas.length; i < len; i++) {
      _data = _datas[i]
      const _keys = _data.keys
      if (
        keys.length === _keys.length &&
        !_keys.some((_key, idx) => _key !== keys[idx])
      ) {
        ret = i
        break
      }
    }
    return ret
  }

  /**
   * 获取所有符合keys的索引
   * @returns {Number[]} 索引组成的数组
   */
  _getIdxs(keys) {
    const ret = []
    let idx = -1
    while (true) {
      idx = this._getIdx(keys, idx + 1)
      if (~idx) {
        ret.push(idx)
      } else {
        break
      }
    }
    return ret
  }

  /**
   * 获取首个符合keys的索引
   * @param {*[]} keys - key组成的数组
   * @returns {*} 获取到的val（若未获取到，则返回undefined）
   */
  get(keys) {
    return (this._datas[this._getIdx(keys)] || {}).val
  }

  /**
   * 获取所有符合keys的索引
   * @param {*[]} keys - key组成的数组
   * @returns {*[]} 获取到的val组成的数组
   */
  gets(keys) {
    const _datas = this._datas
    return this._getIdxs(keys).map((idx) => (_datas[idx] || {}).val)
  }

  /**
   * 添加映射
   * @param {*[]} keys - key组成的数组
   * @param {*} val - 要添加的val
   * @param {Boolean} [returnVal = true] - 是否返回被添加的val
   * @returns {*} 若returnVal为true，则返回被添加的val；否则返回keysMap对象
   */
  add(keys, val, returnVal = true) {
    this._datas.push({
      keys: keys,
      val: val,
    })
    return returnVal ? val : this
  }

  /**
   * 设置首个符合keys的映射
   * @param {*[]} keys - key组成的数组
   * @param {*} val - 要设置的val
   * @param {Boolean} [returnVal = true] - 是否返回被设置的val
   * @returns {*} 若returnVal为true，则返回被设置的val；否则返回keysMap对象
   */
  set(keys, val, returnVal = true) {
    const idx = this._getIdx(keys)
    if (~idx) {
      this._datas[idx].val = val
    } else {
      this.add(keys, val)
    }
    return returnVal ? val : this
  }

  /**
   * 删除首个符合keys的索引
   * @param {*[]} keys - key组成的数组
   * @param {Boolean} [returnVal = true] - 是否返回被删除的val
   * @returns {*} 若returnVal为true，则返回被删除的val；否则返回keysMap对象
   */
  del(keys, returnVal = true) {
    const idx = this._getIdx(keys)
    let val
    if (~idx) {
      val = this._datas.splice(idx, 1)[0].val
    }
    return returnVal ? val : this
  }

  /**
   * 删除所有符合keys的索引
   * @param {*[]} keys - key组成的数组
   * @param {Boolean} [returnVals = true] - 是否返回被删除的val组成的数组
   * @returns {*[]} 若returnVals为true，则返回被删除的val组成的数组；否则返回keysMap对象
   */
  dels(keys, returnVals = true) {
    const _datas = this._datas
    const vals = this._getIdxs(keys).map(
      (idx, correction) => _datas.splice(idx - correction, 1)[0].val
    )
    return returnVals ? vals : this
  }
}
