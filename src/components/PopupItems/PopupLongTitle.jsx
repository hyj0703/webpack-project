import '@jmdd/jmdd-css-flex'
import Img from '@jmdd/jmdd-react-img'
import React from 'react'
import AutoFontSize from '../AutoFontSize/AutoFontSize'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupLongTitle({
  className = '',
  logo,
  theme,
  children,
  ...props
}) {
  return (
    <div
      className={`popup-long-title ${logo ? 'popup-long-title--logo' : ''} ${
        theme ? `popup-long-title--${theme}` : ''
      } ${className}`}
      {...props}>
      {logo ? <Img className="popup-long-title__logo" src={logo}></Img> : null}
      <AutoFontSize className="popup-long-title__txt">{children}</AutoFontSize>
    </div>
  )
})
