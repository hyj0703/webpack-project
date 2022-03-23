import { setIsFakeJdCore, setIsJdCore, setIsRealJdCore } from '@jmdd/jmdd-envs'
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
      setIsJdCore(isJr)
      setIsRealJdCore(() => {
        if (isJr()) {
          return (
            typeof jd !== 'undefined' ||
            typeof WebViewJavascriptBridge !== 'undefined' ||
            Boolean(window?.webkit?.messageHandlers)
          )
        } else {
          return false
        }
      })
      setIsFakeJdCore(() => {
        if (isJr()) {
          return !(
            typeof jd !== 'undefined' ||
            typeof WebViewJavascriptBridge !== 'undefined' ||
            Boolean(window?.webkit?.messageHandlers)
          )
        } else {
          return false
        }
      })
    }
  }
}
