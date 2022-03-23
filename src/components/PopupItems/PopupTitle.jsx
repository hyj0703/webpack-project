import Img from '@jmdd/jmdd-react-img'
import React from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupTitle({
  logo,
  theme,
  className = '',
  children,
  ...props
}) {
  return (
    <div
      className={`popup-title ${logo ? 'popup-title--logo' : ''} ${
        theme ? `popup-title--${theme}` : ''
      } ${className}`}
      {...props}>
      {logo ? <Img className="popup-long-title__logo" src={logo}></Img> : null}
      {children}
    </div>
  )
})
