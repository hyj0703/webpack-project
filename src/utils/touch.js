/**
 * @module touch
 * @version 0.0.0
 */

/**
 * 在touches中查找和target相同identifier的touch的索引
 * @param {TouchList | Touch[]} touches - touches
 * @param {Touch} target - target
 * @returns {Number} 找到的touch（若未找到，则返回-1）
 */
export function findIdx(touches, target) {
  let ret = -1
  if (target) {
    Array.from(touches).some((touch, idx) => {
      if (target.identifier === touch.identifier) {
        ret = idx
        return true
      }
    })
  }
  return ret
}

/**
 * 在touches中查找和target相同identifier的touch
 * @param {TouchList | Touch[]} touches - touches
 * @param {Touch} target - target
 * @returns {Touch | null} 找到的touch（若未找到，则返回null）
 */
export function find(touches, target) {
  const idx = findIdx(touches, target)
  return ~idx ? touches[idx] : null
}

/**
 * 是否是首次touchStart
 * @param {Event} e - touch事件
 * @returns {Boolean} 是否是首次touchStart
 */
export function isFirstTouchStart({ touches, changedTouches }) {
  return (
    touches.length === 1 &&
    changedTouches.length === 1 &&
    touches[0].identifier === changedTouches[0].identifier
  )
}

/**
 * 是否是最后一次touchEnd（或touchCancel）
 * @returns {Boolean} 是否是最后一次touchEnd
 */
export function isLastTouchEnd({ touches }) {
  return !touches.length
}
