import { BABEL_CHANNEL, JR_PING_PAGE_ID } from '../constants/index'
import useJrConf from './useJrConf'

/**
 * 金融环境下发送埋点
 * @param {*} id T2的值
 * @param {*} param 除channel外的其他拓展参数
 * @param {*} type 埋点类型 expo-曝光埋点，click-点击埋点，若是点击埋点此字段可不填写
 */
export default function jrPing({ id, param, type }) {
  try {
    if (useJrConf()) {
      if (type === 'expo') {
        //曝光埋点
        window.__qd__.imp({
          cls: JR_PING_PAGE_ID + '|' + id,
          v: { ...param, channel: BABEL_CHANNEL },
        })
      } else {
        //点击埋点
        window.__qd__.click({
          cls: JR_PING_PAGE_ID + '|' + id,
          v: { ...param, channel: BABEL_CHANNEL },
        })
      }
    }
  } catch (e) {}
}
