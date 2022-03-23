/**
 * @module genId
 * @version 0.0.0
 *
 * @example
 * 生成一个id
 genId(); //将返回一个id（Number类型）
 */

let count = 1 //id计数

/**
 * 生成id
 * @returns {Number} 生成的id
 */
export default function () {
  return count++
}
