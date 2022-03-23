import React, { useMemo } from 'react'
import AutoFontSize from '../AutoFontSize/AutoFontSize'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import StrokeText from '../StrokeText/StrokeText'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupShortBtn({
  className = '',
  theme,
  disabled = false,
  children,
  ...props
}) {
  const strokeText = useMemo(
    () => <StrokeText>{children}</StrokeText>,
    [children]
  )
  return (
    <div
      className={`popup-short-btn ${theme ? `popup-short-btn--${theme}` : ''} ${
        disabled ? 'popup-short-btn--disabled' : ''
      } ${className}`}>
      <AutoFontSize className="popup-short-btn__txt" {...props}>
        {strokeText}
      </AutoFontSize>
    </div>
  )
})
