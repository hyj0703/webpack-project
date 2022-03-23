import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { POPUP_END, POPUP_HIDE } from '../../actions/popup'
import { withPromise } from '../../store'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './Popup.scss'
import PopupTpl from './PopupTpl'

export default connect(
  ({ popup: { popups } }, { type }) => {
    const { [type]: popup } = popups
    let shown = false
    let payloadContentProps = null
    if (popup) {
      shown = popup.shown
      payloadContentProps = popup.payloadContentProps
    }
    return { shown, payloadContentProps, type }
  },
  withPromise((dispatch, { type }) => {
    return {
      hidePopup(ret) {
        return dispatch({
          type: POPUP_HIDE.type,
          payload: { type, ret },
        })
      },
      endPopup(payload) {
        return dispatch({
          type: POPUP_END.type,
          payload,
        })
      },
    }
  })
)(
  withErrorBoundary()(function Popup({
    type,
    shown,
    enterDuration = 600,
    exitDuration = 500,
    onShow,
    onShowing,
    onShown,
    onHide,
    onHidding,
    onHidden,
    endPopup,
    payloadContentProps,
    hidePopup,
    contentProps,
    ...popupTplProps
  }) {
    return (
      <CSSTransition
        in={shown}
        timeout={{ enter: enterDuration, exit: exitDuration }}
        classNames="popup-"
        mountOnEnter
        unmountOnExit
        appear
        onEnter={() => {
          if (onShow) {
            onShow()
          }
        }}
        onEntering={() => {
          if (onShowing) {
            onShowing()
          }
        }}
        onEntered={() => {
          if (onShown) {
            onShown()
          }
        }}
        onExit={() => {
          if (onHide) {
            onHide()
          }
        }}
        onExiting={() => {
          if (onHidding) {
            onHidding()
          }
        }}
        onExited={() => {
          if (onHidden) {
            onHidden()
          }
          endPopup({ type })
        }}>
        <PopupTpl
          {...popupTplProps}
          contentProps={{ ...contentProps, ...payloadContentProps }}
          hidePopup={hidePopup}
        />
      </CSSTransition>
    )
  })
)
