import PreventDefault from '@jmdd/jmdd-react-prevent-default'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './Mask.scss'
import Overlay from './Overlay'

export default withErrorBoundary()(function Mask({
  width = document.documentElement.clientWidth, //遮罩宽度（单位：像素）
  height = document.documentElement.clientHeight, //遮罩高度（单位：像素）
  color = '#000', //遮罩颜色
  opacity = 0.8, //遮罩透明度
  target, //要聚焦到的目标
  shown = false, //是否显示
  uncoveringClickable = true, //露出区域是否可点击
  className = '',
  style,
  ...props
}) {
  const FOCUS_DURATION = 600 //聚焦的时长（单位：毫秒）
  const BLUR_DURATION = 500 //聚焦的时长（单位：毫秒）

  /**
   * 生成关键帧
   * @param {Object} opts - 参数
   *    @param {Object} opts.uncoveringRect - 露出的矩形
   *      @param {Number} opts.uncoveringRect.x - 左上角x（单位：像素）
   *      @param {Number} opts.uncoveringRect.y - 左上角y（单位：像素）
   *      @param {Number} opts.uncoveringRect.width - 宽度（单位：像素）
   *      @param {Number} opts.uncoveringRect.height - 高度（单位：像素）
   *      @param {Number} opts.uncoveringRect.radius - 圆角（单位：像素）
   *    @param {Number} expand - 扩展（单位：像素）
   *    @param {Number} opts.delay - 延迟（单位：毫秒）
   *    @param {Number} opts.duration - 时长（单位：毫秒）
   *    @param {Number} opts.opacity - 透明度
   * @returns {keyframe} 关键帧
   */
  function genKeyframe({
    uncoveringRect: { x, y, width, height, radius },
    expand,
    delay,
    duration,
    opacity,
  }) {
    return {
      uncoveringRect: {
        x: x - expand,
        y: y - expand,
        width: width + expand * 2,
        height: height + expand * 2,
        radius: radius + expand,
      },
      delay,
      duration,
      opacity,
    }
  }

  /**
   * 生成聚焦关键帧
   * @param {Object} opts - 参数
   *    @param {Array} opts.uncoveringRect - 露出的矩形
   *    @param {Number} opts.opacity - 透明度
   * @returns {keyframe[]} 关键帧组成的数组
   */
  function genFocusKeyframes({ uncoveringRect, opacity }) {
    return [
      { expand: 1200, opacity: 0 },
      { expand: -9, duration: 0.4, opacity },
      { expand: 6, duration: 0.2, opacity },
      { expand: -3, duration: 0.2, opacity },
      { expand: 0, duration: 0.2, opacity },
    ].map(({ expand, delay, duration, opacity }) =>
      genKeyframe({
        uncoveringRect,
        expand,
        delay,
        duration: FOCUS_DURATION * duration,
        opacity,
      })
    )
  }

  /**
   * 生成失焦关键帧
   * @param {Object} opts - 参数
   *    @param {Array} opts.uncoveringRect 露出的矩形
   *    @param {Number} opts.opacity - 透明度
   * @returns {keyframe[]} 关键帧组成的数组
   */
  function genBlurKeyframes({ uncoveringRect, opacity }) {
    return [
      { expand: 0, opacity },
      { expand: -18, duration: 0.6, opacity },
      { expand: 1200, duration: 0.4, opacity: 0 },
    ].map(({ expand, delay, duration, opacity }) =>
      genKeyframe({
        uncoveringRect,
        expand,
        delay,
        duration: BLUR_DURATION * duration,
        opacity,
      })
    )
  }

  const [state, setState] = useState('blured') //当前状态，可能的值：focusing、focused、bluring、blured
  const ref = useRef()
  const uncoveringRect = useMemo(() => {
    const { ref } = target
    if (ref) {
      const { padding = 0, radius = 0 } = target
      const { current } = ref
      const {
        left = 0,
        top = 0,
        height = 0,
        width = 0,
      } = (current && current.getBoundingClientRect()) || {}
      return {
        x: left - padding,
        y: top - padding,
        height: height + padding * 2,
        width: width + padding * 2,
        radius,
      }
    } else {
      const {
        x = 0,
        padding = 0,
        y = 0,
        height = 0,
        width = 0,
        radius = 0,
      } = target
      return {
        x: x - padding,
        y: y - padding,
        height: height + padding * 2,
        width: width + padding * 2,
        radius,
      }
    }
  }, [target])
  useEffect(() => {
    switch (state) {
      case 'focusing':
      case 'focused': {
        if (!shown) {
          setState('bluring')
        }
        break
      }
      case 'bluring':
      case 'blured': {
        if (shown) {
          setState('focusing')
        }
        break
      }
    }
  }, [state, shown])
  useEffect(() => {
    const { current: t } = ref
    clearTimeout(t)
    switch (state) {
      case 'focusing': {
        ref.current = setTimeout(() => setState('focused'), FOCUS_DURATION)
        break
      }
      case 'bluring': {
        ref.current = setTimeout(() => setState('blured'), BLUR_DURATION)
        break
      }
    }
  }, [state])
  switch (state) {
    case 'focusing':
    case 'focused':
    case 'bluring': {
      const Wrapper = uncoveringClickable ? 'div' : PreventDefault
      const {
        y: uncoveringRectY,
        height: uncoveringRectHeight,
        x: uncoveringRectX,
        width: uncoveringRectWidth,
      } = uncoveringRect
      return (
        <Wrapper
          className={`mask ${
            uncoveringClickable ? 'mask--uncovering-clickable' : ''
          } ${className}`}
          style={{ height, width, ...style }}
          {...props}>
          {uncoveringClickable ? (
            <>
              <PreventDefault
                className="mask__unclickable-area mask--top"
                style={{ height: uncoveringRectY }}
              />
              <PreventDefault
                className="mask__unclickable-area mask--bottom"
                style={{ top: uncoveringRectY + uncoveringRectHeight }}
              />
              <PreventDefault
                className="mask__unclickable-area mask--left"
                style={{ width: uncoveringRectX }}
              />
              <PreventDefault
                className="mask__unclickable-area mask--right"
                style={{ left: uncoveringRectX + uncoveringRectWidth }}
              />
            </>
          ) : null}
          <Overlay
            color={color}
            height={height}
            keyframes={(state === 'bluring'
              ? genBlurKeyframes
              : genFocusKeyframes)({ uncoveringRect, opacity })}
            width={width}
          />
        </Wrapper>
      )
    }
    case 'blured': {
      return null
    }
  }
})
