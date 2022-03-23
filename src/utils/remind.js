import { parse } from '@jmdd/jmdd-date'
import { isRealJd } from '@jmdd/jmdd-envs'
import toast from '@jmdd/jmdd-toast'
import { complete } from '@jmdd/jmdd-url'
import jdReminder from '@jmfe/jm-jdreminder'
import { REMIND_BUSINESS_TYPE } from '../constants'
import isJr from './isJr'
import isSc from './isSc'

let initedInSc = false //是否在商城环境已初始化

/**
 * 在商城环境初始化
 */
function initInSc() {
  if (isRealJd()) {
    if (!initedInSc) {
      initedInSc = true
      jdReminder.presetReminderOptions({ type: REMIND_BUSINESS_TYPE })
    }
  }
}

/**
 * 检查是否已添加日历提醒
 * @param {Object} opts
 *      @param {String} [opts.type = REMIND_BUSINESS_TYPE] 日历提醒类型
 *      @param {String | Number} opts.id 日历提醒id
 *      @param {String} opts.startTime 日历提醒的开始时间
 *      @param {String} opts.title - 日历提醒的标题
 * @returns {Promise<Boolean>} 是否已添加日历提醒
 */
export async function checkRemind({
  type = REMIND_BUSINESS_TYPE,
  id: rawId,
  startTime,
  title,
}) {
  if (isJr()) {
    if (isRealJd()) {
      return await new Promise((resolve) => {
        const id = String(rawId)
        JrBridge.callNative(
          {
            type: '37',
            identifier: id,
            title,
            startDate: String(+parse(startTime)),
          },
          ({ type, identifier, success }) => {
            if (type === 37 && identifier === id) {
              resolve(Boolean(success))
            }
          }
        )
      })
    } else {
      throw 'not jd'
    }
  } else if (isSc()) {
    if (isRealJd()) {
      initInSc()
      const id = parseInt(rawId)
      const { id: idToCheck, appointed } = await jdReminder.queryReminder({
        type,
        id,
        time: +parse(startTime),
      })
      return id === parseInt(idToCheck) && appointed
    } else {
      throw 'not jd'
    }
  } else {
    throw 'not jd'
  }
}

/**
 * 添加日历提醒
 * @param {Object} opts
 *      @param {String} [opts.type = REMIND_BUSINESS_TYPE] 日历提醒类型
 *      @param {String | Number} opts.id 日历提醒id
 *      @param {String} opts.startTime 日历提醒的开始时间
 *      @param {String} [opts.endTime = startTime当天24点] 日历提醒的结束时间
 *      @param {String} opts.title - 日历提醒的标题
 *      @param {String} opts.url 日历提醒的页面地址
 *      @param {String} opts.tag - 日历提醒的标签（不超过4个字符，超过部分会被截断）
 *      @param {Boolean} [opts.requireToast = true] - 是否需要显示toast
 */
export async function addRemind({
  type = REMIND_BUSINESS_TYPE,
  id: rawId,
  startTime: rawStartTime,
  endTime: rawEndTime,
  title,
  url,
  tag,
  requireToast = true,
}) {
  let ret
  try {
    if (isJr()) {
      if (isRealJd()) {
        ret = await new Promise((resolve) => {
          const id = String(rawId)
          const startTime = parse(rawStartTime)
          const endTime = rawEndTime
            ? parse(rawEndTime)
            : (() => {
                const ret = new Date(+startDate)
                ret.setHours(24, 0, 0, 0)
                return ret
              })()
          JrBridge.callNative(
            {
              type: '36',
              identifier: id,
              title,
              startDate: String(+startTime),
              endDate: String(+endTime),
              backUrl: complete(url),
            },
            ({ type, identifier, success }) => {
              if (type === 36 && identifier === id) {
                if (success === 0) {
                  resolve('add')
                } else {
                  switch (success) {
                    case 1: {
                      resolve('fail')
                      break
                    }
                    case 2: {
                      resolve('cancel')
                      break
                    }
                    case 3: {
                      resolve('deny')
                      break
                    }
                    case 4: {
                      resolve('remove')
                      break
                    }
                    default: {
                      resolve('fail')
                    }
                  }
                }
              }
            }
          )
        })
      } else {
        ret = 'not jd'
      }
    } else if (isSc()) {
      if (isRealJd()) {
        initInSc()
        const { appointed } = await jdReminder.addReminder({
          type,
          id: parseInt(rawId),
          time: +parse(rawStartTime),
          title,
          url: complete(url),
          tag: tag.slice(0, 4),
        })
        if (Number(appointed)) {
          ret = 'add'
        } else {
          ret = 'fail'
        }
      } else {
        ret = 'not jd'
      }
    } else {
      ret = 'not jd'
    }
  } catch (e) {
    ret = 'fail'
  }
  if (requireToast) {
    switch (ret) {
      case 'add': {
        toast({ txt: '添加日历提醒成功', icon: 'suc' })
        break
      }
      case 'remove': {
        toast({ txt: '删除日历提醒成功', icon: 'suc' })
        break
      }
      case 'fail': {
        toast({ txt: '添加日历提醒失败', icon: 'fail' })
        break
      }
      case 'cancel': {
        toast({ txt: '未添加日历提醒', icon: 'info' })
        break
      }
      case 'deny': {
        toast({
          txt: '需要授权“日历”权限才能添加日历提醒',
          icon: 'info',
        })
        break
      }
      case 'not jd': {
        toast({ txt: '在京东App中才能添加日历提醒哦', icon: 'info' })
        break
      }
    }
  }
  switch (ret) {
    case 'add':
    case 'remove': {
      return ret
    }
    case 'fail':
    case 'cancel':
    case 'deny':
    case 'not jd': {
      throw ret
    }
  }
}

/**
 * 删除日历提醒
 * @param {Object} opts
 *      @param {String} [opts.type = REMIND_BUSINESS_TYPE] 日历提醒类型
 *      @param {String | Number} opts.id 日历提醒id
 *      @param {String} opts.startTime 日历提醒的开始时间
 *      @param {String} [opts.endTime = startTime当天24点] 日历提醒的结束时间
 *      @param {String} opts.title - 日历提醒的标题
 *      @param {String} opts.url 日历提醒的页面地址
 *      @param {String} opts.tag - 日历提醒的标签（不超过4个字符，超过部分会被截断）
 *      @param {Boolean} [opts.requireToast = true] - 是否需要显示toast
 */
export async function removeRemind({
  type = REMIND_BUSINESS_TYPE,
  id,
  startTime,
  endTime,
  title,
  url,
  tag,
  requireToast = true,
}) {
  let ret
  try {
    if (isJr()) {
      try {
        ret = await addRemind({
          id,
          startTime,
          endTime,
          title,
          url,
          tag,
          requireToast: false,
        })
      } catch (e) {
        ret = e
      }
    } else if (isSc()) {
      if (isRealJd()) {
        initInSc()
        const { appointed } = await jdReminder.deleteReminder({
          type,
          id: parseInt(id),
          time: +parse(startTime),
        })
        if (appointed) {
          ret = 'remove'
        } else {
          ret = 'fail'
        }
      } else {
        ret = 'not jd'
      }
    } else {
      ret = 'not jd'
    }
  } catch (e) {
    ret = 'fail'
  }
  if (requireToast) {
    switch (ret) {
      case 'add': {
        toast({ txt: '添加日历提醒成功', icon: 'suc' })
        break
      }
      case 'remove': {
        toast({ txt: '删除日历提醒成功', icon: 'suc' })
        break
      }
      case 'fail': {
        toast({ txt: '删除日历提醒失败', icon: 'fail' })
        break
      }
      case 'cancel': {
        toast({ txt: '未删除日历提醒', icon: 'info' })
        break
      }
      case 'deny': {
        toast({
          txt: '需要授权“日历”权限才能删除日历提醒',
          icon: 'info',
        })
        break
      }
      case 'not jd': {
        toast({ txt: '在京东App中才能删除日历提醒哦', icon: 'info' })
        break
      }
    }
  }
  switch (ret) {
    case 'add':
    case 'remove': {
      return ret
    }
    case 'fail':
    case 'cancel':
    case 'deny':
    case 'not jd': {
      throw ret
    }
  }
}
