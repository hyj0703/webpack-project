import { isAndroid, isIos } from '@jmdd/jmdd-envs'
import { compareJdVersion } from '@jmdd/jmdd-versions'
import { callSyncRouterModuleWithParams } from '@jmdd/jmdd-webview-native'

/**
 * 显示推送授权引导
 * @param {Object} opts - 参数
 * @param {String} [opts.sceneId = 'default_1'] - 场景id
 */
export async function showPushPermitGuide({ sceneId = 'default_1' } = {}) {
  if (compareJdVersion('10.3.0')) {
    if (isIos()) {
      await callSyncRouterModuleWithParams({
        routerUrl: 'router://JDMessageCenterModule/showPushOpenGuide',
        routerParams: { scenesId: sceneId },
      })
    } else if (isAndroid()) {
      await callSyncRouterModuleWithParams({
        routerUrl:
          'router://com.jingdong.common.messagepop.JDMessageNoticeManager/showPushOpenGuide',
        routerParams: { scenesId: sceneId },
      })
    }
  } else {
    throw 'disabled'
  }
}

/**
 * 是否已授权推送
 * @returns {Boolean} 是否已授权推送
 */
export async function isPushPermitted() {
  if (compareJdVersion('10.3.0')) {
    if (isIos()) {
      return (
        (await callSyncRouterModuleWithParams({
          routerUrl: 'router://JDMessageCenterModule/pushStateIsOpen',
        })) === '1'
      )
    } else if (isAndroid()) {
      return Boolean(
        await callSyncRouterModuleWithParams({
          routerUrl:
            'router://com.jingdong.common.messagepop.JDMessageNoticeManager/isNotificationEnable',
        })
      )
    } else {
      return false
    }
  } else {
    throw 'disabled'
  }
}
