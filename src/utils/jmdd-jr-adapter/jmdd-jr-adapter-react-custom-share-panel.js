import { setFilterKeyChannelsCore } from '@jmdd/jmdd-react-custom-share-panel'
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
      setFilterKeyChannelsCore(() => {})
    }
  }
}
