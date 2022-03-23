import getEncryptedActivityId from '@jmdd/jmdd-get-encrypted-activity-id'
import { BETA_HOST, PRO_HOST } from '@jmdd/jmdd-service-function-id'
import { getQuery, setQuery } from '@jmdd/jmdd-url'

//start:公用
export const LOCAL_DEVELOP_PATHNAME = '/' //活动本地开发版地址
export const DEVELOP_PATHNAME = '' //活动开发版地址
export const TRIAL_PATHNAME = '' //活动体验版地址
export const READY_PATHNAME = '' //活动准线上版地址

// 测试专用
// export const TRIAL_PATHNAME = '/babelDiy/Zeus/31dEsr4HTzCnLsRjHkWUdvfTssdr/index.html' //活动体验版地址
export const IS_LOCAL_DEVELOP = location.pathname === LOCAL_DEVELOP_PATHNAME //是否是本地开发环境
export const IS_DEVELOP = location.pathname === DEVELOP_PATHNAME //是否是开发环境
export const IS_TRIAL = location.pathname === TRIAL_PATHNAME //是否是体验环境
export const IS_READY = location.pathname === READY_PATHNAME //是否是准线上环境
export const IS_PRO = !IS_LOCAL_DEVELOP && !IS_DEVELOP && !IS_TRIAL && !IS_READY //是否是正式环境
export const VERSION =
  {
    [LOCAL_DEVELOP_PATHNAME]: '本地开发版',
    [DEVELOP_PATHNAME]: '开发版',
    [TRIAL_PATHNAME]: '体验版',
    [READY_PATHNAME]: '准线上版',
  }[location.pathname] || '正式版' //版本
export const HOST =
  {
    [LOCAL_DEVELOP_PATHNAME]: BETA_HOST,
    [DEVELOP_PATHNAME]: BETA_HOST,
    [TRIAL_PATHNAME]: BETA_HOST,
    [READY_PATHNAME]: PRO_HOST,
  }[location.pathname] || PRO_HOST //host
export const WITH_FUNCTION_ID_IN_QUERY = true //是否在query携带functionId，方便mock
export const BABEL_CHANNEL = getQuery('babelChannel') || '' //渠道
export const ACTIVITY_URL = `//${location.host}${location.pathname}` //活动基础地址
export const ACTIVITY_URL_WITH_BABEL_CHANNEL = setQuery(
  ACTIVITY_URL,
  'babelChannel',
  BABEL_CHANNEL
) //带babelChannel的活动基础地址
export const QRY_COMPOSITE_MATERIALS_APPLY_KEY = 'jd_star' //qryCompositeMaterials的applyKey
export const REMIND_BUSINESS_TYPE = 'DACUZANIANSHOU' //日历提醒的businessType
export const CART_ADD_SOURCE = 'dcddg' //加购的source
export const ACTIVITY_ID = '01144582' //活动id
export const ENCRYPTED_ACTIVITY_ID =
  getEncryptedActivityId() || '41AJZXRUJeTqdBK9bPoPgUJiodcU' //加密活动id
export const REPORT_MPIN_BUSINESS_CODE = '20136' //上报的mpin的businessCode
export const TITLE = '全民炸年兽' //标题
//end:公用

//start:是否显示系统升级中
export const UPGRADE_GROUP_ID = '05916251' //整个活动是否显示系统升级中广告组id
export const BRANCH_UPGRADE_GROUP_ID = '05917038' //支线是否显示系统升级中广告组id
//end:是否显示系统升级中

//start:人机识别
export const SMASH_APP_ID = '50144' //人机识别appId
export const SMASH_SCENE_ID = {
  load: 'ZNSZLh5', //加载页
  main: 'ZNShPageh5', //主线玩法
  branch: 'ZNSZXh5', //支线玩法
}
//end:人机识别
