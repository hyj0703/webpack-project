import { isIos, isJd } from '@jmdd/jmdd-envs'
import {
  compareAndroidVersion,
  compareIosVersion,
  compareJdVersion,
} from '@jmdd/jmdd-versions'
import { callJdAppUnite } from '@jmdd/jmdd-webview-native'
import { versionCompare } from '@jmfe/jm-common'

/**
 * 比较版本
 * @param {String | null} versionA - 版本a（null表示无法比较的版本）
 * @param {String | null} versionB - 版本b（null表示无法比较的版本）
 * @param {String} [type = '>='] - 比较方式（可能的值：'>'-版本a是否大于版本b；'<'-版本a是否小于版本b；'='-版本a是否等于版本b；'>='-版本a是否大于等于版本b；'<='-版本a是否小于等于版本b；'!='-版本a是否不等于版本b）
 * @returns {Boolean} 是否满足比较条件
 */
function compareVersion(versionA, versionB, type) {
  if (versionA === null || versionB === null) {
    return false
  } else {
    const ret = versionCompare(versionA, versionB)
    switch (type) {
      case '>':
        return ret > 0
      case '<':
        return ret < 0
      case '=':
        return ret === 0
      case '>=':
        return ret >= 0
      case '<=':
        return ret <= 0
      case '!=':
        return ret !== 0
    }
  }
}

/**
 * 比较ios设备版本
 * @param {String} version - 要比较的版本
 * @param {String} [type = '>='] - 比较方式（可能的值：'>'-是否大于要比较的版本；'<'-是否小于要比较的版本；'='-是否等于要比较的版本；'>='-是否大于等于要比较的版本；'<='-是否小于等于要比较的版本；'!='-是否不等于要比较的版本）
 * @returns {Boolean | null} 是否满足比较条件（若无法比较，则返回null）
 */
async function compareIosDeviceVersion(version, type = '>=') {
  if (isIos()) {
    try {
      const {
        data: { model },
      } = await callJdAppUnite({
        requireCb: {
          requireJson: true,
          namePath: '',
        },
        method: 'getPhoneBasicInfo',
      })
      const iosDeviceVersion = model.replace(/^iphone/i, '').replace(/,/g, '.')
      return compareVersion(iosDeviceVersion, version.replace(/,/g, '.'), type)
    } catch (e) {
      return false
    }
  } else {
    return false
  }
}

/**
 * 检测ar是否可用
 * @returns {Boolean} 是否可用
 */
export async function isArEnabled() {
  if (isJd()) {
    if (compareJdVersion('9.0.0', '>=')) {
      return (
        (compareIosVersion('11.0.0', '>=') &&
          (await compareIosDeviceVersion('8,1', '>=')) &&
          (await compareIosDeviceVersion('8,4', '!='))) ||
        compareAndroidVersion('7.0.0', '>')
      )
    }
  }
  return false
}
