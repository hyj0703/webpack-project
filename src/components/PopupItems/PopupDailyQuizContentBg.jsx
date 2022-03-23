import React from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import FlexBg from '../FlexBg/FlexBg'
import defaultImg from './nosprite/content_bg.png'
import popupDailyQuizImg from './nosprite/popup_daily_quiz_content_bg.png'
import './PopupItems.scss'

export default withErrorBoundary()(function PopupDailyQuizContentBg({
  className = '',
  state = false,
  ...props
}) {
  return (
    <FlexBg
      bgs={[
        {
          img: state ? popupDailyQuizImg : defaultImg,
          width: 520,
          height: 492,
          cornerSize: 40,
        },
      ]}
      className={`popup-content-bg ${className}`}
      {...props}></FlexBg>
  )
})
