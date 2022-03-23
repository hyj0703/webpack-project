import AfterBack from '@jmdd/jmdd-after-back'
import { isRealJd } from '@jmdd/jmdd-envs'
import isJr from '../isJr'
import { invisible } from './jmdd-jr-adapter-visible-by-jd'

let adapted = !isJr() //是否已适配

/**
 * 适配
 * @returns 适配完成
 */
export default function adapter() {
  if (!adapted) {
    adapted = true
    if (isJr() && isRealJd()) {
      const {
        prototype: { start: rawStart },
      } = AfterBack
      AfterBack.prototype.start = function () {
        invisible()
        rawStart.call(this)
      }
    }
  }
}
