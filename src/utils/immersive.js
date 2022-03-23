/**
 * @module jmddImmersive
 * @see {@link http://npm.m.jd.com/package/@jmfe/jm-xheader}
 * @see {@link https://cf.jd.com/pages/viewpage.action?pageId=121472141}
 * @see {@link http://doc.jd.com/webview/doc/h5/m_page/navigation/navi_ui.html}
 */

import { isAndroid, isRealJd } from '@jmdd/jmdd-envs'
import { complete } from '@jmdd/jmdd-url'
import xheader, { onNavHeightChange } from '@jmfe/jm-xheader'
import isJr from './isJr'
import isSc from './isSc'

const IMMERSIVE_CORRECTED_LOCAL_STORAGE_KEY = 'immersiveCorrected' //修正的导航栏高度在localStorage的key
const onChangeInfos = [] //导航栏高度变化时的处理函数信息组成的数组
let immersived = false //是否已经设置过沉浸式
let lastNavHeight = null //上次导航栏高度变化时的导航栏高度（单位：像素）
let tChkEffected = null //检测沉浸式是否已起作用的计时器
let chkEffectedTimes = null //检测沉浸式是否已起作用的检测次数
let lastChkEffectedHeight = null //上次检测沉浸式是否已起作用时的页面高度（单位：像素）

/**
 * 检测沉浸式是否已起作用
 */
function chkEffected(inRecursion = false) {
  if (!inRecursion) {
    chkEffectedTimes = 10
  }
  clearTimeout(tChkEffected)
  tChkEffected = null
  const height = document.documentElement.clientHeight
  if (lastChkEffectedHeight === null) {
    lastChkEffectedHeight = height
  }
  if (lastChkEffectedHeight === height) {
    if (chkEffectedTimes-- > 0) {
      tChkEffected = setTimeout(() => chkEffected(true), 200)
    } else {
      chkEffectedTimes = null
      lastChkEffectedHeight = null
    }
  } else {
    if (lastNavHeight !== null) {
      callOnChanges(lastNavHeight)
    }
  }
}

/**
 * 调用所有导航栏高度变化时的处理函数
 * @param {Number} navHeight - 导航栏高度（单位：像素）
 */
function callOnChanges(navHeight) {
  lastNavHeight = navHeight
  const height = document.documentElement.clientHeight
  onChangeInfos.forEach((onChangeInfo) => {
    const { useCorrected, lastNavHeight, lastHeight, onChange } = onChangeInfo
    if (useCorrected) {
      navHeight = Number(
        localStorage.getItem(IMMERSIVE_CORRECTED_LOCAL_STORAGE_KEY)
      )
    } else {
      localStorage.setItem(IMMERSIVE_CORRECTED_LOCAL_STORAGE_KEY, navHeight)
    }
    if (lastNavHeight !== navHeight || lastHeight !== height) {
      onChangeInfo.lastNavHeight = navHeight
      onChangeInfo.lastHeight = height
      onChange(navHeight)
    }
  })
}

/**
 * 导航栏高度变化时的处理函数
 * @callback module:jmddImmersive~onChange
 * @param {Number} navHeight - 导航栏高度（当处于非沉浸式时，导航栏高度为0）
 */

/**
 * 设置沉浸式
 * @param {Object} [opts = {}] - 参数
 *    @param {module:jmddImmersive~onChange} [opts.onChange] - 导航栏高度变化时的处理函数
 *    @param {String} [opts.title = 空白图片] - 标题图片地址（465×90）
 *    @param {String} [opts.titleWithBg = 空白图片] - 当显示背景颜色时的标题图片地址（465×90）
 *    @param {String} [opts.jrTitle = ''] - 金融环境中的标题
 *    @param {String} [opts.btnType = 'wb'] - 按钮类型（可能的值：wb；bb；bw；bb；ww）
 *    @param {String} [opts.bg = '#ffffff'] - 背景颜色
 *    @param {Boolean} [opts.requireCorrect = false] - 是否修正导航栏高度
 * @returns {Promise<Function>} 解绑导航栏高度变化时的处理函数
 */
export default async function immersive({
  onChange,
  title = '//m.360buyimg.com/mobileActivity/jfs/t1/141103/28/8359/111/5f602687E06befa98/541dedc39d30ec53.png',
  titleWithBg = '//m.360buyimg.com/mobileActivity/jfs/t1/141103/28/8359/111/5f602687E06befa98/541dedc39d30ec53.png',
  jrTitle = '',
  btnType = 'wb',
  bg = '#ffffff',
  requireCorrect = false,
} = {}) {
  let onChangeInfo = null
  if (onChange) {
    onChangeInfo = {
      lastNavHeight: null, //上次导航栏高度变化时的导航栏高度
      lastHeight: null, //上次导航栏高度变化时的页面高度
      onChange,
      useCorrected:
        requireCorrect &&
        Boolean(localStorage.getItem(IMMERSIVE_CORRECTED_LOCAL_STORAGE_KEY)), //是否使用修正的导航栏高度
    }
    onChangeInfos.push(onChangeInfo)
  }
  if (isJr()) {
    if (isRealJd()) {
      if (lastNavHeight !== null) {
        callOnChanges(lastNavHeight)
      }
      callOnChanges(
        await new Promise((resolve) => {
          JrBridge.setTopBarShare({
            version: 100,
            moreItem: false,
            transparentConfig: {
              enable: true,
              title: jrTitle,
              normalConfig: {
                naviIcon: btnType.slice(0, 1) === 'b' ? 2 : 1,
                showTitle: 0,
              },
              scrollConfig: {
                naviIcon: btnType.slice(1, 2) === 'b' ? 2 : 1,
                showTitle: 1,
                bgColor: bg,
              },
            },
          })
          JrBridge.callNative({ type: '74' }, ({ navBarTotalHeight }) =>
            resolve(navBarTotalHeight)
          )
        })
      )
    } else {
      callOnChanges(0)
    }
  } else if (isSc()) {
    if (isRealJd()) {
      if (lastNavHeight !== null) {
        callOnChanges(lastNavHeight)
      }
      callOnChanges(
        await xheader({
          canPull: '0',
          supportTran: '1',
          tranParams: {
            whiteImg: complete(title),
            blackImg: complete(titleWithBg),
            backgroundColor: bg,
            naviMenuType: btnType,
          },
          titleImgWidth: isAndroid() ? '200' : '400',
        })
      )
      if (!immersived) {
        immersived = true
        chkEffected()
        onNavHeightChange(callOnChanges)
      }
    } else {
      callOnChanges(0)
    }
  } else {
    callOnChanges(0)
  }
  return function offChange() {
    if (onChangeInfo) {
      const idx = onChangeInfos.indexOf(onChangeInfo)
      if (~idx) {
        onChangeInfos.splice(idx, 1)
      }
    }
  }
}
