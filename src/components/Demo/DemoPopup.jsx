import React from 'react'
import { connect } from 'react-redux'
import { POPUP_IS_SHOWN, POPUP_SHOW } from '../../actions/popup'
import { withPromise } from '../../store'
import withPopup from '../Popup/withPopup'
import './DemoPopup.scss'

const PopupDemoLeft = withPopup({
  type: 'demoLeft',
  position: 'left',
  className: 'demo-popup',
})(function PopupDemoLeft({ hidePopup }) {
  return (
    <div className="demo-popup__content">
      <button onClick={hidePopup}>隐藏</button>
    </div>
  )
})

const PopupDemoRight = withPopup({
  type: 'demoRight',
  position: 'right',
  className: 'demo-popup',
})(function PopupDemoRight({ hidePopup }) {
  return (
    <div className="demo-popup__content">
      <button onClick={hidePopup}>隐藏</button>
    </div>
  )
})

const PopupDemoTop = withPopup({
  type: 'demoTop',
  position: 'top',
  className: 'demo-popup',
})(function PopupDemoTop({ hidePopup }) {
  return (
    <div className="demo-popup__content">
      <button onClick={hidePopup}>隐藏</button>
    </div>
  )
})

const PopupDemoBottom = withPopup({
  type: 'demoBottom',
  position: 'bottom',
  className: 'demo-popup',
})(function PopupDemoBottom({ hidePopup }) {
  return (
    <div className="demo-popup__content">
      <button onClick={hidePopup}>隐藏</button>
    </div>
  )
})

const PopupDemoCenter = connect(
  null,
  withPromise((dispatch) => {
    return {
      isShown(payload) {
        return dispatch({
          type: POPUP_IS_SHOWN.type,
          payload,
        })
      },
    }
  })
)(
  withPopup({
    type: 'demoCenter',
    position: 'center',
    className: 'demo-popup',
  })(function PopupDemoCenter({ hidePopup, isShown }) {
    return (
      <div className="demo-popup__content">
        <button onClick={hidePopup}>隐藏</button>
        <button
          onClick={async () => alert(await isShown({ type: 'demoCenter' }))}>
          水平居中弹框-是否显示
        </button>
      </div>
    )
  })
)

const PopupDemoMiddle = withPopup({
  type: 'demoMiddle',
  position: 'middle',
  className: 'demo-popup',
})(function PopupDemoMiddle({ hidePopup }) {
  return (
    <div className="demo-popup__content">
      <button onClick={hidePopup}>隐藏</button>
    </div>
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
)(function DemoPopup({ showPopup }) {
  return (
    <>
      <button onClick={() => showPopup({ type: 'demoLeft' })}>居左弹框</button>
      <button onClick={() => showPopup({ type: 'demoRight' })}>居右弹框</button>
      <button onClick={() => showPopup({ type: 'demoTop' })}>居顶弹框</button>
      <button onClick={() => showPopup({ type: 'demoBottom' })}>
        居底弹框
      </button>
      <button onClick={() => showPopup({ type: 'demoCenter' })}>
        水平居中弹框
      </button>
      <button onClick={() => showPopup({ type: 'demoMiddle' })}>
        垂直居中弹框
      </button>
      <PopupDemoLeft />
      <PopupDemoRight />
      <PopupDemoTop />
      <PopupDemoBottom />
      <PopupDemoCenter />
      <PopupDemoMiddle />
    </>
  )
})
