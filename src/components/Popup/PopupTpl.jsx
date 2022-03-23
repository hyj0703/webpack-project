import React, { useEffect, useRef } from 'react'
import './Popup.scss'

export default function PopupTpl({
  position = 'center', //弹窗出现的位置，可能的值：top-居上；bottom-居下；left-居左；right-居右；center-水平居中，middle-垂直居中
  hideByClickOverlay = false, //是否可点击遮罩隐藏。可传入函数，表示可点击遮罩隐藏；且点击遮罩隐藏时，该函数会被调用，函数的返回值会作为弹窗流程的返回值返回
  className = '', //className
  overlayColor = 'rgba(0,0,0,.8)', //遮罩颜色
  zIndex = 100, //z-index（为null表示不设置z-index）
  hidePopup,
  children,
  contentProps,
  ...props
}) {
  const ref = useRef()

  //start:判断是否阻止touchmove以阻止弹窗背景滚动
  useEffect(() => {
    const { current } = ref
    function onTouchMove(e) {
      let requirePreventDefault = true
      const { target } = e
      let cur = target
      while (true) {
        if (cur instanceof Element) {
          const { overflow, overflowX, overflowY } = getComputedStyle(cur)
          if (
            [(overflow, overflowX, overflowY)].some(
              (overflow) => overflow === 'auto' || overflow === 'scroll'
            )
          ) {
            const { scrollHeight, clientHeight, scrollWidth, clientWidth } = cur
            if (scrollHeight > clientHeight || scrollWidth > clientWidth) {
              requirePreventDefault = false
              break
            }
          } else if (target === current) {
            break
          }
        } else {
          break
        }
        cur = cur.parentNode
      }
      if (requirePreventDefault) {
        e.preventDefault()
      }
    }
    current.addEventListener('touchmove', onTouchMove)
    return () => current.removeEventListener('touchmove', onTouchMove)
  }, [])
  //end:判断是否阻止touchmove以阻止弹窗背景滚动

  return (
    <div
      className={`popup popup--position-${position} ${className}`}
      ref={ref}
      style={{ ...(zIndex === null ? {} : { zIndex }) }}
      {...props}>
      <div
        className="popup__overlay"
        onClick={() => {
          if (hideByClickOverlay) {
            hidePopup(
              typeof hideByClickOverlay === 'function'
                ? hideByClickOverlay()
                : undefined
            )
          }
        }}
        style={{ backgroundColor: overlayColor }}></div>
      {children({ props: contentProps, hidePopup })}
    </div>
  )
}
