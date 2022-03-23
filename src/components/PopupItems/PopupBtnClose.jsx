import React from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupBtnClose({
  className = '',
  ...props
}) {
  return <a className={`popup-btn-close ${className}`} {...props}></a>
})
