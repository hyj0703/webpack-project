import React from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import FlexBg from '../FlexBg/FlexBg'
import img from '../../img/logo.png'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupLightContentBg({
  className = '',
  ...props
}) {
  return (
    <FlexBg
      bgs={[
        {
          img,
          width: 520,
          height: 492,
          cornerSize: 40,
        },
      ]}
      className={`popup-light-content-bg ${className}`}
      {...props}></FlexBg>
  )
})
