import { setGetJdVersionCore } from '@jmdd/jmdd-versions'
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
      setGetJdVersionCore(() => {
        const { userAgent } = navigator
        const [, ret = null] =
          userAgent.match(/clientVersion=([\d\.]+)&/i) || []
        return ret
      })
    }
  }
}
