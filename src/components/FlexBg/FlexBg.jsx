import '@jmdd/jmdd-css-flex'
import React, { useEffect, useRef, useState } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './FlexBg.scss'
import FlexBgItem from './FlexBgItem'

export default withErrorBoundary()(function FlexBg({
  className = '',
  children,
  bgs = [],
  updateKey,
  outerRef,
  ...props
}) {
  /**
   * 获取“当前页面宽度相对于750像素宽度的缩放比例”
   */
  function getScale() {
    return document.documentElement.clientWidth / 750
  }

  /**
   * 获取缩放后的背景相关尺寸大小
   */
  function getScaledBgSize({
    bg: {
      width = 0,
      height = 0,
      cornerSize = 0,
      cornerWidth = cornerSize,
      cornerHeight = cornerSize,
      leftWidth = cornerWidth,
      rightWidth = cornerWidth,
      topHeight = cornerHeight,
      bottomHeight = cornerHeight,
    } = {},
    scale,
  }) {
    return {
      bgWidth: width * scale,
      bgHeight: height * scale,
      bgLeftWidth: leftWidth * scale,
      bgRightWidth: rightWidth * scale,
      bgTopHeight: topHeight * scale,
      bgBottomHeight: bottomHeight * scale,
    }
  }

  const contentRef = useRef()
  const contentSizeRef = useRef({ contentWidth: NaN, contentHeight: NaN })
  const [
    {
      bgImg,
      bgWidth,
      bgHeight,
      bgLeftWidth,
      bgRightWidth,
      bgTopHeight,
      bgBottomHeight,
      sizeXPercent,
      sizeYPercent,
      sizeX,
      sizeY,
    },
    set,
  ] = useState(() => ({
    bgImg: null,
    ...getScaledBgSize({ bg: bgs[0], scale: getScale() }),
    sizeXPercent: NaN,
    sizeYPercent: NaN,
    sizeX: NaN,
    sizeY: NaN,
  }))
  useEffect(() => {
    const scale = getScale()
    const {
      current: { offsetWidth: newContentWidth, offsetHeight: newContentHeight },
    } = contentRef
    const {
      current: { contentWidth, contentHeight },
    } = contentSizeRef
    if (
      newContentWidth !== contentWidth ||
      newContentHeight !== contentHeight
    ) {
      contentSizeRef.current = {
        contentWidth: newContentWidth,
        contentHeight: newContentHeight,
      }

      //start:在bgs中寻找宽高比最接近内容的bg
      let bg = {}
      let minDiffAbs = Infinity //“背景宽高比”和“dom宽高比”的最小差值的绝对值
      bgs.forEach((tmpBg) => {
        const {
          width: tmpBgWidth,
          height: tmpBgHeight,
          cornerSize: tmpCornerSize = 0,
          cornerWidth: tmpBgCornerWidth = tmpCornerSize,
          cornerHeight: tmpBgCornerHeight = tmpCornerSize,
          leftWidth: tmpBgLeftWidth = tmpBgCornerWidth,
          rightWidth: tmpBgRightWidth = tmpBgCornerWidth,
          topHeight: tmpBgTopHeight = tmpBgCornerHeight,
          bottomHeight: tmpBgBottomHeight = tmpBgCornerHeight,
        } = tmpBg
        const tmpBgWidthHeightRatio = tmpBgWidth / tmpBgHeight
        const tmpDiffAbs = Math.abs(
          tmpBgWidthHeightRatio -
            (newContentWidth + (tmpBgLeftWidth + tmpBgRightWidth) * scale) /
              (newContentHeight + (tmpBgTopHeight + tmpBgBottomHeight) * scale)
        )
        if (tmpDiffAbs < minDiffAbs) {
          bg = tmpBg
          minDiffAbs = tmpDiffAbs
        }
      })
      //end:在bgs中寻找宽高比最接近内容的bg

      const { img: newBgImg = null } = bg
      const {
        bgWidth: scaledNewBgWidth,
        bgHeight: scaledNewBgHeight,
        bgLeftWidth: scaledNewBgLeftWidth,
        bgRightWidth: scaledNewBgRightWidth,
        bgTopHeight: scaledNewBgTopHeight,
        bgBottomHeight: scaledNewBgBottomHeight,
      } = getScaledBgSize({ bg, scale })
      const newSizeXPercent =
        newContentWidth /
        (scaledNewBgWidth - scaledNewBgLeftWidth - scaledNewBgRightWidth)
      const newSizeYPercent =
        newContentHeight /
        (scaledNewBgHeight - scaledNewBgTopHeight - scaledNewBgBottomHeight)
      const newSizeX = newSizeXPercent * scaledNewBgWidth
      const newSizeY = newSizeYPercent * scaledNewBgHeight
      set({
        bgImg: newBgImg,
        bgWidth: scaledNewBgWidth,
        bgHeight: scaledNewBgHeight,
        bgLeftWidth: scaledNewBgLeftWidth,
        bgRightWidth: scaledNewBgRightWidth,
        bgTopHeight: scaledNewBgTopHeight,
        bgBottomHeight: scaledNewBgBottomHeight,
        sizeXPercent: newSizeXPercent,
        sizeYPercent: newSizeYPercent,
        sizeX: newSizeX,
        sizeY: newSizeY,
      })
    }
  }, [
    updateKey,
    bgImg,
    bgWidth,
    bgHeight,
    bgLeftWidth,
    bgRightWidth,
    bgTopHeight,
    bgBottomHeight,
    sizeXPercent,
    sizeYPercent,
    sizeX,
    sizeY,
  ])
  return (
    <div
      className={`jmdd-flex--m flex-bg ${className}`}
      ref={outerRef}
      {...props}>
      <div className="jmdd-flex--c flex-bg__t">
        <FlexBgItem
          className="flex-bg__t-l"
          img={bgImg}
          posX={0}
          posY={0}
          sizeX={bgWidth}
          sizeY={bgHeight}
          height={bgTopHeight}
          width={bgLeftWidth}
        />
        <FlexBgItem
          className="flex-bg__t-c"
          img={bgImg}
          posX={-bgLeftWidth * sizeXPercent}
          posY={0}
          sizeX={sizeX}
          sizeY={bgHeight}
          height={bgTopHeight}
        />
        <FlexBgItem
          className="flex-bg__t-r"
          img={bgImg}
          posX={bgRightWidth - bgWidth}
          posY={0}
          sizeX={bgWidth}
          sizeY={bgHeight}
          height={bgTopHeight}
          width={bgRightWidth}
        />
      </div>
      <div className="jmdd-flex--c flex-bg__m">
        <FlexBgItem
          className="flex-bg__m-l"
          img={bgImg}
          posX={0}
          posY={-bgTopHeight * sizeYPercent}
          sizeX={bgWidth}
          sizeY={sizeY}
          width={bgLeftWidth}
        />
        <FlexBgItem
          className="flex-bg__m-c"
          img={bgImg}
          outerRef={contentRef}
          posX={-bgLeftWidth * sizeXPercent}
          posY={-bgTopHeight * sizeYPercent}
          sizeX={sizeX}
          sizeY={sizeY}>
          {children}
        </FlexBgItem>
        <FlexBgItem
          className="flex-bg__m-r"
          img={bgImg}
          posX={bgRightWidth - bgWidth}
          posY={-bgTopHeight * sizeYPercent}
          sizeX={bgWidth}
          sizeY={sizeY}
          width={bgRightWidth}
        />
      </div>
      <div className="jmdd-flex--c flex-bg__b">
        <FlexBgItem
          className="flex-bg__b-l"
          img={bgImg}
          posX={0}
          posY={bgBottomHeight - bgHeight}
          sizeX={bgWidth}
          sizeY={bgHeight}
          height={bgBottomHeight}
          width={bgLeftWidth}
        />
        <FlexBgItem
          className="flex-bg__b-c"
          img={bgImg}
          posX={-bgLeftWidth * sizeXPercent}
          posY={bgBottomHeight - bgHeight}
          sizeX={sizeX}
          sizeY={bgHeight}
          height={bgBottomHeight}
        />
        <FlexBgItem
          className="flex-bg__b-r"
          img={bgImg}
          posX={bgRightWidth - bgWidth}
          posY={bgBottomHeight - bgHeight}
          sizeX={bgWidth}
          sizeY={bgHeight}
          height={bgBottomHeight}
          width={bgRightWidth}
        />
      </div>
    </div>
  )
})
