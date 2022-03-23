import React, { useMemo } from 'react'
import AutoFontSize from '../AutoFontSize/AutoFontSize'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import StrokeText from '../StrokeText/StrokeText'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupBtn({
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
      className={`popup-btn ${theme ? `popup-btn--${theme}` : ''} ${
        disabled ? 'popup-btn--disabled' : ''
      } ${className}`}>
      <AutoFontSize className="popup-btn__txt" {...props}>
        {strokeText}
      </AutoFontSize>
    </div>
  )
})
