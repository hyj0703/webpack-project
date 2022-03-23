import { isWk } from '@jmdd/jmdd-envs'
import isJr from './isJr'

function configBtnSince610(type, param) {
  try {
    const params = JSON.stringify({
      [type]:
        type === 'custom'
          ? (param || []).map((param) => {
              return { type, ...param }
            })
          : {
              type,
              ...param,
            },
    })
    if (isWk()) {
      window.webkit.messageHandlers.MobileNavi.postMessage({
        method: 'configBtnSince610',
        params,
      })
    } else {
      window.MobileNavi && window.MobileNavi.configBtnSince610(params)
    }
  } catch (e) {}
}

export default function hideBtnMore() {
  if (isJr()) {
    JrBridge.setTopBar({ moreItem: false })
  } else {
    configBtnSince610('clear_js')
    configBtnSince610('hidemore', { display: 'hide' })
  }
}
