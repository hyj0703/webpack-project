import '@jd/smash-h5'
import getUuid from '@jmdd/jmdd-get-uuid'
import { SMASH_APP_ID } from '../constants/index'

const DEF_LOG = -1 //默认log

export let defSceneId = '' //默认sceneId

/**
 * 初始化方法
 * @param {Object} opts - 参数
 *    @param {String} opts.sceneId - 场景id
 */
export async function smashInit({ sceneId }) {
  try {
    smashUtils.init({
      appid: SMASH_APP_ID,
      sceneid: sceneId,
      uid: await getUuid(),
    })
    defSceneId = sceneId
  } catch (e) {
    console.error(e)
  }
}

/**
 * 获取随机数和log
 * @returns {Object} 随机数和log组成的对象
 */
export function smashGetRandomAndLog() {
  const random = Math.floor(10000000 + Math.random() * 90000000).toString() //随机数-8位整数
  let log = DEF_LOG
  try {
    log =
      smashUtils.get_risk_result({ id: random, data: { random } }).log ||
      DEF_LOG
  } catch (e) {
    console.error(e)
  }
  return { random, log }
}

/**
 * 获取log
 * @returns {String} log
 */
export function smashGetLog() {
  const { log } = smashGetRandomAndLog()
  return log
}

/**
 * 获取签名
 * @param {Object} opts - 参数
 *    @param {String} opts.secretp - 用于人机识别的加密pin
 *    @param {String} [opts.sceneId = defSceneId] - 场景id
 * @returns {String} 签名
 */
export function smashGetSafeStr({ secretp, sceneId = defSceneId }) {
  const { log, random } = smashGetRandomAndLog()
  return JSON.stringify({
    extraData: { log: encodeURIComponent(log), sceneid: sceneId },
    secretp,
    random,
  })
}
