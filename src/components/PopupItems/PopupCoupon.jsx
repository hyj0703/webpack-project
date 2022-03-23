import React from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupCoupon({
  className = '',
  ...props
}) {
  return <div className={`popup-coupon ${className}`} {...props}></div>
})
