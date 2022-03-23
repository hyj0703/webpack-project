import { prefix } from '@jmdd/jmdd-prefix'
import React, { useEffect, useRef, useState } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './Flipper.scss'

export default withErrorBoundary()(function Flipper({
  className = '',
  children,
  ...props
}) {
  const ref = useRef()
  const [prismRadius, setPrismRadius] = useState(null) //棱柱体半径（单位：像素）
  const [idx, setIdx] = useState(-1) //当前显示的child的索引
  useEffect(() => {
    const { current } = ref
    setPrismRadius((current.offsetHeight / 2) * Math.tan((30 / 180) * Math.PI))
  }, [children])
  useEffect(() => {
    const { current } = ref

    /**
     * idx递增
     */
    function idxIncrease({ animationName }) {
      if (
        animationName === 'flipperRotateOdd' ||
        animationName === 'flipperRotateEven'
      ) {
        setIdx(idx + 1)
      }
    }

    current.addEventListener(prefix.animationEnd, idxIncrease)
    return () => current.removeEventListener(prefix.animationEnd, idxIncrease)
  }, [children, idx])
  useEffect(() => setIdx(idx + 1), [])
  const { length = 0 } = children || {}
  return (
    <span
      className={`flipper ${className}`}
      {...props}
      ref={ref}
      flipper-type={idx % 2 ? 'odd' : 'even'}>
      {prismRadius === null ? null : (
        <div className="flipper__flipper">
          <span
            className="flipper__front"
            style={{
              [prefix.transform
                .bcc]: `rotateX(0deg) translate3d(0, 0, ${prismRadius}px)`,
            }}>
            {length ? children[idx % length] : null}
          </span>
          <span
            className="flipper__back"
            style={{
              [prefix.transform
                .bcc]: `rotateX(120deg) translate3d(0, 0, ${prismRadius}px)`,
            }}>
            {length ? children[(idx + 1) % length] : null}
          </span>
        </div>
      )}
    </span>
  )
})
