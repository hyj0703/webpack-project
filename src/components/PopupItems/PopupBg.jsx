import React from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import FlexBg from '../FlexBg/FlexBg'
import img from '../../img/logo.png'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupBg({
  className = '',
  children,
  ...props
}) {
  return (
    <FlexBg
      bgs={[
        {
          img,
          width: 606,
          height: 982,
          leftWidth: 80,
          rightWidth: 80,
          topHeight: 80,
          bottomHeight: 170,
        },
      ]}
      className={`popup-bg ${className}`}
      {...props}>
      <div className="popup-bg__left-decoration"></div>
      <div className="popup-bg__right-decoration"></div>
      <div className="popup-bg__content">{children}</div>
    </FlexBg>
  )
})
