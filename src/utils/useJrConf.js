import { getQuery } from '@jmdd/jmdd-url'
import isJr from './isJr'

/**
 * 是否使用金融配置
 * @returns {Boolean} 是否使用金融配置
 */
export default function useJrConf() {
  return isJr() || getQuery('conf') === 'jr'
}
