/**
 * hashCode
 * @param {String} str - 要进行hashCode的值
 * @returns {String} 生成的hashCode值
 */
export default function hashCode(str) {
  let ret = 0
  if (ret === 0 && typeof str === 'string') {
    for (let i = 0; i < str.length; i++) {
      ret = (((31 * ret) | 0) + str.charCodeAt(i)) | 0
    }
  }
  return String(ret)
}
