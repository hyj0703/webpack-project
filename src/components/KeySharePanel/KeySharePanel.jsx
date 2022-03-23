import AfterBack from '@jmdd/jmdd-after-back'
import '@jmdd/jmdd-css-flex'
import { SHARE_CHANNEL } from '@jmdd/jmdd-full-share'
import toast from '@jmdd/jmdd-toast'
import React from 'react'
import withPopup from '../Popup/withPopup'
import './KeySharePanel.scss'

export default withPopup({
  type: 'keySharePanel',
  hideByClickOverlay: true,
  zIndex: 800,
})(function KeySharePanel({ channel, keyCopyTips, onResult, hidePopup }) {
  const {
    [channel]: { name, scheme },
  } = {
    [SHARE_CHANNEL.wx]: {
      name: '微信',
      scheme: 'weixin://',
    },
    [SHARE_CHANNEL.qq]: {
      name: 'QQ',
      scheme: 'mqq://',
    },
    [SHARE_CHANNEL.qzone]: {
      name: 'QQ空间',
      scheme: 'mqq://',
    },
    [SHARE_CHANNEL.weibo]: {
      name: '新浪微博',
      scheme: 'sinaweibo://',
    },
  }
  return (
    <div className="key_share_panel" key-share-panel-channel={channel}>
      <p className="key_share_panel_title">金口令已经复制</p>
      <p className="key_share_panel_subtitle">
        {keyCopyTips || `快去${name}粘贴给好友吧`}
      </p>
      <p className="key_share_panel_tips">
        好友可打开最新版京东金融App粘贴到搜索栏内参与
      </p>
      <a
        className="jmdd-flex--c key_share_panel_btn_call"
        onClick={() => {
          JrBridge.callNative(
            { type: '33', openUrl: scheme },
            ({ type, openFlag }) => {
              if (type === 33) {
                if (openFlag) {
                  location.href = scheme
                } else {
                  toast({ txt: `打开${name}失败，请手动打开`, icon: 'fail' })
                }
                new AfterBack({
                  cb() {
                    if (onResult) {
                      onResult({ shareResult: '0' })
                    }
                  },
                }).start()
              }
            }
          )
        }}>
        去<span className="key_share_panel_btn_call_icon"></span>
        {name}粘贴给好友
      </a>
      <a className="key_share_panel_btn_hide" onClick={hidePopup}></a>
    </div>
  )
})
