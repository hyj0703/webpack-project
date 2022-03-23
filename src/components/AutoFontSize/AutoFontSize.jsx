import '@jmdd/jmdd-css-flex'
import { prefix } from '@jmdd/jmdd-prefix'
import React, { useEffect, useRef, useState } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './AutoFontSize.scss'

export default withErrorBoundary()(function AutoFontSize({
  tag = 'div',
  xAlign = 'c',
  yAlign = 'm',
  className = '',
  children,
  ...props
}) {
  const ref = useRef()
  const contentRef = useRef()
  const [{ offsetX, offsetY, scale }, setTransform] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  })
  useEffect(() => {
    const { current: dom } = ref
    const { width, height, left, top } = dom.getBoundingClientRect()
    const { current: domContent } = contentRef
    const {
      width: rawContentWidth,
      height: rawContentHeight,
      left: contentLeft,
      top: contentTop,
    } = domContent.getBoundingClientRect()
    const contentWidth = rawContentWidth / scale
    const contentHeight = rawContentHeight / scale
    const newScale = Math.floor(Math.min(width / contentWidth, 1) * 100) / 100 //只保留2位小数，防止因浮点数精度导致的scale在极小的范围内震荡
    let newOffsetX = left - (contentLeft - offsetX)
    let newOffsetY = top - (contentTop - offsetY)
    switch (xAlign) {
      case 'l': {
        newOffsetX += 0
        break
      }
      case 'c': {
        newOffsetX += (width - contentWidth * newScale) / 2
        break
      }
      case 'r': {
        newOffsetX += width - contentWidth * newScale
        break
      }
    }
    switch (yAlign) {
      case 't': {
        newOffsetY += 0
        break
      }
      case 'm': {
        newOffsetY += (height - contentHeight * newScale) / 2
        break
      }
      case 'b': {
        newOffsetY += height - contentHeight * newScale
        break
      }
    }
    newOffsetX = Math.round(newOffsetX) //只保留整数，防止因浮点数精度导致offsetX在极小的范围内震荡
    newOffsetY = Math.round(newOffsetY) //只保留整数，防止因浮点数精度导致offsetY在极小的范围内震荡
    if (
      scale !== newScale ||
      offsetX !== newOffsetX ||
      offsetY !== newOffsetY
    ) {
      setTransform({
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      })
    }
  }, [scale, offsetX, offsetY, xAlign, yAlign, children])
  const Tag = tag
  return (
    <Tag className={`auto-font-size ${className}`} ref={ref} {...props}>
      <span
        className="auto-font-size__content"
        ref={contentRef}
        style={{
          [prefix.transform
            .bcc]: `translate(${offsetX}px, ${offsetY}px) scale(${scale}, ${scale})`,
        }}>
        {children}
      </span>
    </Tag>
  )
})
