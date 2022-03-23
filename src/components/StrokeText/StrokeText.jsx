import React from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './StrokeText.scss'

export default withErrorBoundary()(function StrokeText({
  tag = 'div',
  className = '',
  children,
  ...props
}) {
  const Tag = tag
  return (
    <Tag className={`stroke-text ${className}`} {...props}>
      <span className="stroke-text__stroke">{children}</span>
      <span className="stroke-text__text">{children}</span>
    </Tag>
  )
})
