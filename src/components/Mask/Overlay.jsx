import React, { Fragment } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'

/**
 * 矩形
 * @typedef {Object} rect
 * @property {Number} x - 左上角x（单位：像素）
 * @property {Number} y - 左上角y（单位：像素）
 * @property {Number} width - 宽度（单位：像素）
 * @property {Number} height - 高度（单位：像素）
 * @property {Number} radius - 圆角（单位：像素）
 */

/**
 * 关键帧
 * @typedef {Object} keyframe
 * @property {rect} uncoveringRect - 露出的矩形
 * @property {Number} delay - 延迟（单位：毫秒）
 * @property {Number} duration - 时长（单位：毫秒）
 * @property {Number} opacity - 透明度
 */

export default withErrorBoundary()(function Overlay({
  width = document.documentElement.clientWidth, //遮罩宽度（单位：像素）
  height = document.documentElement.clientHeight, //遮罩高度（单位：像素）
  color = '#000', //遮罩颜色
  keyframes = [], //遮罩动画关键帧组成的数组
  ...props
}) {
  /**
   * 获取遮罩d
   */
  function getOverlayD() {
    return `M0,0 L${width},0 L${width},${height} L0,${height} Z`
  }

  /**
   * 获取露出的矩形d
   * @param {rect} uncoveringRect - 露出的矩形
   */
  function getUncoveringRectD({ x, y, width, height, radius }) {
    radius = Math.min(radius, width / 2, height / 2)
    width = Math.max(width - radius * 2, 0)
    height = Math.max(height - radius * 2, 0)
    return [
      `M${x + radius},${y}`,
      `a${radius},${radius} 90 0 0 ${-radius},${radius}`,
      `l0,${height}`,
      `a${radius},${radius} 90 0 0 ${radius},${radius}`,
      `l${width},0`,
      `a${radius},${radius} 90 0 0 ${radius},${-radius}`,
      `l0,${-height}`,
      `a${radius},${radius} 90 0 0 ${-radius},${-radius}`,
      `z`,
    ].join(' ')
  }

  /**
   * 获取d
   * @param {rect} uncoveringRect - 露出的矩形
   * @returns {String} 获取到的d
   */
  function getD(uncoveringRect) {
    return [
      getOverlayD(),
      ...(uncoveringRect ? [getUncoveringRectD(uncoveringRect)] : []),
    ].join(' ')
  }

  const [{ uncoveringRect, opacity } = {}] = keyframes
  return (
    <svg
      key={JSON.stringify(keyframes)}
      viewBox={`0 0 ${width} ${height}`}
      {...props}>
      <path d={getD(uncoveringRect)} fill={color} opacity={opacity}>
        {keyframes
          .slice(0, -1)
          .map(({ delay = 0, uncoveringRect, opacity = 1 }, idx) => {
            const lastIdx = idx - 1
            const beginStart = idx ? `animateD${lastIdx}.end` : ''
            const beginDelay =
              delay > 0
                ? `${beginStart ? '+' : ''}${delay}ms`
                : delay < 0
                ? `${delay}ms`
                : ''
            const begin =
              beginStart || beginDelay ? beginStart + beginDelay : '0ms'
            const {
              length,
              [Math.min(idx + 1, length - 1)]: {
                duration: nextDuration = 0,
                uncoveringRect: nextUncoveringRect,
                opacity: nextOpacity,
              },
            } = keyframes
            const dur = `${nextDuration}ms`
            return (
              <Fragment key={idx}>
                <animate
                  attributeName="d"
                  begin={begin}
                  dur={dur}
                  fill="freeze"
                  from={getD(uncoveringRect)}
                  id={`animateD${idx}`}
                  to={getD(nextUncoveringRect)}
                />
                <animate
                  attributeName="opacity"
                  begin={begin}
                  dur={dur}
                  fill="freeze"
                  from={opacity}
                  id={`animateOpacity${idx}`}
                  to={nextOpacity}
                />
              </Fragment>
            )
          })}
      </path>
    </svg>
  )
})
