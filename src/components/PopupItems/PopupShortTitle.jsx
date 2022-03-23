import '@jmdd/jmdd-css-flex'
import Img from '@jmdd/jmdd-react-img'
import React from 'react'
import AutoFontSize from '../AutoFontSize/AutoFontSize'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupShortTitle({
  logo,
  theme,
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={`popup-short-title ${logo ? 'popup-short-title--logo' : ''} ${
        theme ? `popup-short-title--${theme}` : ''
      } ${className}`}
      {...props}>
      {logo ? <Img className="popup-long-title__logo" src={logo}></Img> : null}
      <AutoFontSize className="popup-short-title__txt">{children}</AutoFontSize>
    </div>
  )
})
