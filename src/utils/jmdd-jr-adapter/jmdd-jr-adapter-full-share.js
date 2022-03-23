import { isIos } from '@jmdd/jmdd-envs'
import {
  setCallSharePaneCoreInJd,
  setFilterKeyChannelsCoreInJd,
  setHideShareInfoCoreInJd,
  setIsKeyEnabledCore,
  setSendDirectShareCoreInJd,
  setSetShareInfoCoreInJd,
  SHARE_CHANNEL,
} from '@jmdd/jmdd-full-share'
import { hidePageLoading, showPageLoading } from '@jmdd/jmdd-page-loading'
import axios, { unwrap } from '@jmdd/jmdd-service-axios'
import toast from '@jmdd/jmdd-toast'
import { serialize } from '@jmfe/jm-common'
import { POPUP_SHOW } from '../../actions/popup'
import { promiseDispatch } from '../../store'
import isJr from '../isJr'
import afterBackAdapt from './jmdd-jr-adapter-after-back'
import envsAdapt from './jmdd-jr-adapter-envs'
import versionsAdapt from './jmdd-jr-adapter-versions'
import visibleByJdAdapt from './jmdd-jr-adapter-visible-by-jd'

let adapted = !isJr() //是否已适配

/**
 * 获取“金口令”分享文字内容和提示
 * @param {String} keyUrl - 金口令分享地址
 */
async function getKeyContentAndCopyTips(keyUrl) {
  try {
    const {
      defaults: { timeout },
    } = axios
    showPageLoading()
    const {
      resultData: {
        data: { code, copySuccessText },
      },
    } = await unwrap({
      method: 'post',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      url: '//ms.jr.jd.com/gw/generic/jrm/h5/m/build',
      data: serialize({
        reqData: encodeURIComponent(
          JSON.stringify({
            request: {
              url: keyUrl,
              keyChannel: 'Wxfriends',
            },
          })
        ),
      }),
      withCredentials: true,
      timeout,
    })
    hidePageLoading()
    if (code) {
      return {
        keyContent: code,
        keyCopyTips: copySuccessText,
      }
    } else {
      throw 'no code'
    }
  } catch (e) {
    hidePageLoading()
    toast({ txt: '生成金口令失败', icon: 'fail' })
    throw e
  }
}

/**
 * 金口令分享
 */
async function keyShare({ keyUrl, channels: [channel], onResult }) {
  const { keyContent, keyCopyTips } = await getKeyContentAndCopyTips(keyUrl)
  JrBridge.callNative({ type: '27', boardText: keyContent })
  JrBridge.callNative({ type: '66', order: keyContent })
  await promiseDispatch({
    type: POPUP_SHOW.type,
    payload: { type: 'keySharePanel', channel, keyCopyTips, onResult },
  })
}

/**
 * 适配
 * @returns 适配完成
 */
export default function adapt() {
  if (!adapted) {
    adapted = true
    if (isJr()) {
      envsAdapt()
      versionsAdapt()
      visibleByJdAdapt()
      afterBackAdapt()
      setFilterKeyChannelsCoreInJd(() => {})
      setSetShareInfoCoreInJd(() => {})
      setHideShareInfoCoreInJd(() => JrBridge.setTopBar({ hideTools: true }))
      setSendDirectShareCoreInJd(async (shareOpts) => {
        const {
          url,
          img,
          title,
          desc,
          timeline,
          longImg,
          mpTitle,
          mpId,
          mpImg,
          mpPath,
          mpVersion,
          keyChannels,
          keyEndTime,
          keyContent,
          keyUrl,
          keyImg,
          keyTitle,
          keySourceCode,
          keyId,
          channels: [channel],
          onResult,
          onSelect,
        } = shareOpts
        switch (channel) {
          case SHARE_CHANNEL.wx:
          case SHARE_CHANNEL.timeline:
          case SHARE_CHANNEL.qq:
          case SHARE_CHANNEL.qzone:
          case SHARE_CHANNEL.weibo: {
            if (onSelect) {
              onSelect({
                shareChannel: {
                  [SHARE_CHANNEL.wx]: 'Wxfriends',
                  [SHARE_CHANNEL.timeline]: 'Wxmoments',
                  [SHARE_CHANNEL.qq]: 'QQfriends',
                  [SHARE_CHANNEL.qzone]: 'QQzone',
                  [SHARE_CHANNEL.weibo]: 'Sinaweibo',
                }[channel],
              })
            }
            if (~keyChannels.indexOf(channel)) {
              keyShare(shareOpts)
            } else {
              JrBridge.callNative(
                {
                  type: '44',
                  data: {
                    sharePlatform: {
                      [SHARE_CHANNEL.wx]: '0',
                      [SHARE_CHANNEL.timeline]: '1',
                      [SHARE_CHANNEL.qq]: '4',
                      [SHARE_CHANNEL.qzone]: '3',
                      [SHARE_CHANNEL.weibo]: '2',
                    }[channel],
                    shareType: '0',
                    shareTitle:
                      channel === SHARE_CHANNEL.timeline ? timeline : title,
                    shareContent: desc,
                    shareUrl: url,
                    shareImageUrl: img,
                  },
                },
                ({ type, success }) => {
                  if (type === 44) {
                    if (onResult) {
                      onResult({ shareResult: success === '0' ? '0' : '1' })
                    }
                  }
                }
              )
            }
            break
          }
          case SHARE_CHANNEL.longImg: {
            if (onSelect) {
              if (isIos()) {
                onSelect({ shareEvent: 'ShareQRClick' })
              } else {
                onSelect({ shareChannel: 'QRCode' })
              }
            }
            await promiseDispatch({
              type: POPUP_SHOW.type,
              payload: {
                type: 'longImgSharePanel',
                longImg,
                onSelect,
                onResult,
              },
            })
            break
          }
        }
      })
      setCallSharePaneCoreInJd(
        async ({
          url,
          img,
          title,
          desc,
          timeline,
          longImg,
          mpTitle,
          mpId,
          mpImg,
          mpPath,
          mpVersion,
          keyChannels,
          keyEndTime,
          keyContent,
          keyUrl,
          keyImg,
          keyTitle,
          keySourceCode,
          keyId,
          channels,
          onResult,
          onSelect,
        }) => {
          const channelList = (
            await Promise.all(
              channels.map(async (channel) => {
                const id = {
                  [SHARE_CHANNEL.wx]: 1,
                  [SHARE_CHANNEL.timeline]: 0,
                  [SHARE_CHANNEL.qq]: 4,
                  [SHARE_CHANNEL.qzone]: 5,
                  [SHARE_CHANNEL.weibo]: 2,
                }[channel]
                const shareType = (() => {
                  if (
                    channel === SHARE_CHANNEL.wx &&
                    ~keyChannels.indexOf(channel) &&
                    keyUrl
                  ) {
                    return 3
                  } else if (
                    channel === SHARE_CHANNEL.wx &&
                    mpTitle &&
                    mpId &&
                    mpImg &&
                    mpPath
                  ) {
                    return 1
                  } else {
                    return 0
                  }
                })()
                if (
                  typeof id !== 'undefined' &&
                  typeof shareType !== 'undefined'
                ) {
                  let order
                  let content
                  if (shareType === 3) {
                    const { keyContent, keyCopyTips } =
                      await getKeyContentAndCopyTips(keyUrl)
                    order = keyContent
                    content = keyCopyTips
                  }
                  return {
                    id,
                    shareType,
                    link: url,
                    userName: mpId,
                    path: mpPath,
                    order,
                    content,
                  }
                }
              })
            )
          ).filter((channelItem) => channelItem)
          JrBridge.callNative(
            {
              type: '4',
              shareDataNew: {
                isLogin: '0',
                imageUrl: img,
                linkTitle: title,
                linkSubtitle: desc,
                channelList,
              },
            },
            ({ share: { shareState, sharePlat } }) => {
              switch (shareState) {
                case '1': {
                  if (onSelect) {
                    onSelect({
                      shareChannel: {
                        2: 'Wxfriends',
                        1: 'Wxmoments',
                        3: 'Sinaweibo',
                      }[sharePlat],
                    })
                  }
                  break
                }
                case '2': {
                  if (onResult) {
                    onResult({ shareResult: '0' })
                  }
                  break
                }
                case '3': {
                  if (onResult) {
                    onResult({ shareResult: '1' })
                  }
                  break
                }
              }
            }
          )
        }
      )
      setIsKeyEnabledCore(() => true)
      SHARE_CHANNEL.longImgQzone = 'longImgQzone'
      SHARE_CHANNEL.longImgWeibo = 'longImgWeibo'
    }
  }
}
