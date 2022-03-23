import '@jmdd/jmdd-css-flex'
import React from 'react'
import './FlexBg.scss'

export default function FlexBgItem({
  outerRef,
  img,
  posX,
  posY,
  sizeX,
  sizeY,
  height,
  width,
  ...props
}) {
  return height === 0 || width === 0 ? null : (
    <div
      ref={outerRef}
      style={(() => {
        {
          const ret = {}
          if (img && !isNaN(posX) && !isNaN(posY)) {
            ret.backgroundImage = `url(${img})`
            ret.backgroundPosition = `${posX}px ${posY}px`
            ret.WebkitBackgroundSize =
              ret.backgroundSize = `${sizeX}px ${sizeY}px`
          }
          if (!isNaN(height)) {
            ret.height = height
          }
          if (!isNaN(width)) {
            ret.width = width
          }
          return ret
        }
      })()}
      {...props}></div>
  )
}
