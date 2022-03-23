import { isApp } from '@jmfe/jm-common'

/**
 * 是否是商城环境
 * @returns {Boolean} 是否是商城环境
 */
export default function isSc() {
  return isApp('jd')
}
