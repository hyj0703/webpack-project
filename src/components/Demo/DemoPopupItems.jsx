import '@jmdd/jmdd-css-flex'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { POPUP_SHOW } from '../../actions/popup'
import { withPromise } from '../../store'
import withPopup from '../Popup/withPopup'
import PopupBg from '../PopupItems/PopupBg'
import PopupBtn from '../PopupItems/PopupBtn'
import PopupBtnClose from '../PopupItems/PopupBtnClose'
import PopupContentBg from '../PopupItems/PopupContentBg'
import PopupCoupon from '../PopupItems/PopupCoupon'
import PopupLightContentBg from '../PopupItems/PopupLightContentBg'
import PopupLongTitle from '../PopupItems/PopupLongTitle'
import PopupShortBtn from '../PopupItems/PopupShortBtn'
import PopupShortTitle from '../PopupItems/PopupShortTitle'
import PopupTitle from '../PopupItems/PopupTitle'
import './DemoPopupItems.scss'

const LOGO =
  '//m.360buyimg.com/babel/s180x90_jfs/t1/205701/20/10968/5827/616686d6Ea1732812/13f1fd088ef44289.png'

const PopupDemoPopupItems = withPopup({
  type: 'demoPopupItems',
  position: 'center',
  className: 'demo-popup-items',
})(function PopupDemoPopupItems({ hidePopup, logo, theme }) {
  return (
    <PopupBg>
      <PopupBtnClose onClick={hidePopup} />
      <PopupTitle logo={logo} theme={theme} />
      <PopupContentBg>
        <div style={{ height: 30 }}></div>
      </PopupContentBg>
      <PopupLightContentBg>
        <div style={{ height: 30 }}></div>
      </PopupLightContentBg>
      <PopupCoupon />
      <PopupBtn>去用券 享低价</PopupBtn>
      <PopupBtn theme="red">去用券 享低价</PopupBtn>
      <PopupBtn disabled={true}>去用券 享低价</PopupBtn>
      <div className="jmdd-flex--c">
        <PopupShortBtn>咖啡</PopupShortBtn>
        <PopupShortBtn theme="red">去用券 享低价</PopupShortBtn>
      </div>
      <div className="jmdd-flex--c">
        <PopupShortBtn disabled={true}>咖啡</PopupShortBtn>
        <PopupShortBtn theme="red" disabled={true}>
          去用券 享低价
        </PopupShortBtn>
      </div>
    </PopupBg>
  )
})

const PopupDemoPopupItemsWithShortTitle = withPopup({
  type: 'demoPopupItemsWithShortTitle',
  position: 'center',
  className: 'demo-popup-items',
})(function PopupDemoPopupItems({ hidePopup, logo, theme }) {
  return (
    <PopupBg>
      <PopupBtnClose onClick={hidePopup} />
      <PopupShortTitle logo={logo} theme={theme}>
        标题文字
      </PopupShortTitle>
      <PopupContentBg>
        <div style={{ height: 100 }}></div>
      </PopupContentBg>
      <PopupBtn>我知道了</PopupBtn>
    </PopupBg>
  )
})

const PopupDemoPopupItemsWithLongTitle = withPopup({
  type: 'demoPopupItemsWithLongTitle',
  position: 'center',
  className: 'demo-popup-items',
})(function PopupDemoPopupItems({ hidePopup, logo, theme }) {
  return (
    <PopupBg>
      <PopupBtnClose onClick={hidePopup} />
      <PopupLongTitle logo={logo} theme={theme}>
        标题文字标题文字
      </PopupLongTitle>
      <PopupContentBg>
        <div style={{ height: 100 }}></div>
      </PopupContentBg>
      <PopupBtn>我知道了</PopupBtn>
    </PopupBg>
  )
})

const PopupDemoPopupItemsUpdate = withPopup({
  type: 'demoPopupItemsUpdate',
  position: 'center',
  className: 'demo-popup-items',
})(function PopupDemoPopupItems({ hidePopup }) {
  const [height, setHeight] = useState(200)
  return (
    // 当updateKey变化时，就会重新检测组件高度并渲染背景
    // 注：这里并不要求是height，任何变化的值均能触发重新检测
    <PopupBg updateKey={height}>
      <PopupBtnClose onClick={hidePopup} />
      {/* 当updateKey变化时，就会重新检测组件高度并渲染背景 */}
      {/* 注：这里并不要求是height，任何变化的值均能触发重新检测 */}
      <PopupContentBg updateKey={height}>
        <div style={{ height }}></div>
      </PopupContentBg>
      <div className="jmdd-flex--c">
        <PopupShortBtn onClick={() => setHeight(height + 50)}>
          加高度
        </PopupShortBtn>
        <PopupShortBtn theme="red" onClick={() => setHeight(height - 50)}>
          减高度
        </PopupShortBtn>
      </div>
    </PopupBg>
  )
})

export default connect(
  null,
  withPromise((dispatch) => {
    return {
      showPopup(payload) {
        return dispatch({
          type: POPUP_SHOW.type,
          payload,
        })
      },
    }
  })
)(function DemoPopupItems({ showPopup }) {
  const [logo, setLogo] = useState('')
  const [theme, setTheme] = useState('')
  return (
    <>
      <label>
        <input
          type="checkbox"
          defaultChecked={logo === LOGO}
          onInput={() => setLogo(logo === LOGO ? '' : LOGO)}
        />
        是否带logo
      </label>
      <label>
        <input
          type="checkbox"
          defaultChecked={theme === 'cry'}
          onInput={() => setTheme(theme === 'cry' ? '' : 'cry')}
        />
        年兽是否哭
      </label>
      <br />
      <button
        onClick={() => showPopup({ type: 'demoPopupItems', logo, theme })}>
        带定制化组件的弹窗
      </button>
      <button
        onClick={() =>
          showPopup({ type: 'demoPopupItemsWithShortTitle', logo, theme })
        }>
        短标题弹窗
      </button>
      <button
        onClick={() =>
          showPopup({ type: 'demoPopupItemsWithLongTitle', logo, theme })
        }>
        长标题弹窗
      </button>
      <button
        onClick={() =>
          showPopup({ type: 'demoPopupItemsUpdate', logo, theme })
        }>
        刷新弹窗高度
      </button>
      <PopupDemoPopupItems />
      <PopupDemoPopupItemsWithShortTitle />
      <PopupDemoPopupItemsWithLongTitle />
      <PopupDemoPopupItemsUpdate />
    </>
  )
})
