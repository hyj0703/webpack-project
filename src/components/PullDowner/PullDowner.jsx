import '@jmdd/jmdd-css-flex'
import { getScrollTop } from '@jmdd/jmdd-scroll-position'
import React, { useEffect, useRef, useState } from 'react'
import scrollparent from 'scrollparent'
import { off as offOneFinger, on as onOneFinger } from '../../utils/oneFinger'
import Tween from '../../utils/Tween.js'
import './PullDowner.scss'

export default function PullDowner({
  enabled = true, //是否可用
  threshold = 0.1, //当下拉释放时的下拉距离的阈值（相对于content高度的百分比）
  duration = 300, //回弹或扩展到最大下拉高度的时长（单位：毫秒）
  cubicBezierParams = [0, 0, 0.3, 1.1], //回弹或扩展到最大下拉高度的贝塞尔参数
  content, //生成下拉后显示内容的函数，最大下拉高度也与该内容的高度相同
  children, //生成被下拉元素的函数
  onStart, //当开始下拉/上拉时的处理函数
  onRelease, //当下拉/上拉后开始释放时的处理函数
  onEnough, //当下拉/上拉距离超过阈值时，下拉/上拉释放时的处理函数
  onNotEnough, //当下拉/上拉距离未超过阈值时，下拉/上拉释放时的处理函数
  onStop, //当回弹被停止时的处理函数
  onBack, //回弹到原位时的处理函数
  onFold, //当上拉距离超过阈值时，收起到顶部的处理函数
  onExpand, //当下拉距离超过阈值时，扩展到最大下拉高度时的处理函数
  refreshId, //刷新id，如果该id有变化，则会刷新所有内部逻辑
}) {
  const destroyedRef = useRef(false) //是否已经销毁
  const apisRef = useRef({})
  const ref = useRef()
  const contentHeightGetterRef = useRef()
  const [contentContainerMarginTop, setContentContainerMarginTop] =
    useState(NaN)
  useEffect(() => {
    const { current: dom } = ref
    const { current: domContentHeightGetter } = contentHeightGetterRef
    let status = 'folding' //状态，可能的值：folded-正在收起到顶部；expanding-正在扩展到最大下拉高度
    let byApi = null //本次下拉/上拉是否由api触发
    let legal = null //本次下拉/上拉操作是否合法
    let enough = null //本次下拉/上拉释放时下拉距离是否超过阈值
    let touchStartDistance = null //touchStart的distance
    let touchStartPageX = null //touchStart的pageX
    let touchStartPageY = null //touchStart的pageY
    let tween = Tween.gen({ distance: 0 })
      .onUpdate(function () {
        const {
          obj: { distance },
        } = this
        const { offsetHeight: contentHeight } = domContentHeightGetter
        setContentContainerMarginTop(distance - contentHeight)
      })
      .onStop(() => {
        if (legal) {
          onStop && onStop(apis)
        }
      })
      .onComplete(() => {
        if (byApi || legal) {
          if (byApi || enough) {
            switch (status) {
              case 'folding': {
                onFold && onFold(apis)
                break
              }
              case 'expanding': {
                onExpand && onExpand(apis)
                break
              }
            }
          } else {
            onBack && onBack(apis)
          }
        } else {
          onBack && onBack(apis)
        }
        byApi = null
        legal = null
        enough = null
        touchStartDistance = null
        touchStartPageX = null
        touchStartPageY = null
      })
      .callUpdate() //回弹的tween对象

    /**
     * 判断元素及其祖先元素是否存在position为fixed的
     * @param {HTMLElement} target - 要判断的元素
     * @returns {Boolean} 元素及其祖先元素是否存在position为fixed的
     */
    function isPositionFixed(target) {
      while (target instanceof Element) {
        if (getComputedStyle(target).position === 'fixed') {
          return true
        }
        target = target.parentNode
      }
      return false
    }

    /**
     * 更新distance
     * @param {module:oneFinger~event} e - oneFinger分装的事件
     */
    function updateDistance({ touch: { pageY }, e }) {
      if (legal) {
        const { offsetHeight: contentHeight } = domContentHeightGetter
        tween.obj.distance = Math.min(
          touchStartDistance + pageY - touchStartPageY,
          contentHeight
        )
        tween.callUpdate()
        e.preventDefault()
      }
    }

    /**
     * touchEnd和touchCancel的处理函数
     */
    function touchEndAndTouchCancel() {
      byApi = false
      let newDistance
      const { offsetHeight: contentHeight } = domContentHeightGetter
      if (legal) {
        onRelease && onRelease(apis)
        const {
          obj: { distance },
        } = tween
        switch (status) {
          case 'folding': {
            if (distance / contentHeight > threshold) {
              status = 'expanding'
              enough = true
              onEnough && onEnough(apis)
              newDistance = contentHeight
            } else {
              enough = false
              onNotEnough && onNotEnough(apis)
              newDistance = 0
            }
            break
          }
          case 'expanding': {
            if ((contentHeight - distance) / contentHeight > threshold) {
              status = 'folding'
              enough = true
              onEnough && onEnough(apis)
              newDistance = 0
            } else {
              enough = false
              onNotEnough && onNotEnough(apis)
              newDistance = contentHeight
            }
            break
          }
        }
      } else {
        switch (status) {
          case 'folding': {
            newDistance = 0
            break
          }
          case 'expanding': {
            newDistance = contentHeight
            break
          }
        }
      }
      tween.to({ distance: newDistance }, duration, cubicBezierParams).start()
    }

    const oneFingerId = onOneFinger({
      dom: dom,
      onStart({ touch: { target, pageX, pageY } }) {
        if (enabled) {
          tween.stop()
          if (
            !isPositionFixed(target) &&
            getScrollTop(scrollparent(dom)) <= 0
          ) {
            const {
              obj: { distance },
            } = tween
            legal = null
            enough = null
            touchStartDistance = distance
            touchStartPageX = pageX
            touchStartPageY = pageY
          } else {
            legal = false
            enough = null
            touchStartDistance = null
            touchStartPageX = null
            touchStartPageY = null
          }
        }
      },
      onMove(e) {
        if (enabled) {
          //判断本次下拉操作是否合法
          if (legal === null) {
            const {
              touch: { pageX, pageY },
            } = e
            switch (status) {
              case 'folding': {
                //“向下滑动且滑动角度与垂直方向的夹角小于45度”才视为合法
                legal =
                  pageY > touchStartPageY &&
                  (Math.atan(
                    Math.abs(
                      (pageX - touchStartPageX) / (pageY - touchStartPageY)
                    )
                  ) /
                    Math.PI) *
                    180 <=
                    45
                break
              }
              case 'expanding': {
                //“向上滑动且滑动角度与垂直方向的夹角小于45度”才视为合法
                legal =
                  pageY < touchStartPageY &&
                  (Math.atan(
                    Math.abs(
                      (pageX - touchStartPageX) / (pageY - touchStartPageY)
                    )
                  ) /
                    Math.PI) *
                    180 <=
                    45
                break
              }
            }
            if (legal) {
              onStart && onStart(apis)
            }
          }
          updateDistance(e)
        }
      },
      onEnd(e) {
        if (enabled) {
          updateDistance(e)
          touchEndAndTouchCancel()
        }
      },
      onCancel(e) {
        if (enabled) {
          updateDistance(e)
          touchEndAndTouchCancel()
        }
      },
    })

    /**
     * 收起到顶部
     * @param {Boolean} [withTransition = true] - 是否有过渡
     */
    function fold(withTransition = true) {
      const { current: destroyed } = destroyedRef
      if (!destroyed) {
        byApi = true
        status = 'folding'
        const newDistance = 0
        if (withTransition) {
          tween
            .to({ distance: newDistance }, duration, cubicBezierParams)
            .start()
        } else {
          tween.obj.distance = newDistance
          tween.callUpdate()
        }
      }
    }

    /**
     * 扩展到最大下拉高度
     * @param {Boolean} [withTransition = true] - 是否有过渡
     */
    function expand(withTransition = true) {
      const { current: destroyed } = destroyedRef
      if (!destroyed) {
        byApi = true
        status = 'expanding'
        const { offsetHeight: newDistance } = domContentHeightGetter
        if (withTransition) {
          tween
            .to({ distance: newDistance }, duration, cubicBezierParams)
            .start()
        } else {
          tween.obj.distance = newDistance
          tween.callUpdate()
        }
      }
    }

    const { current } = apisRef
    current.fold = fold
    current.expand = expand

    return () => {
      destroyedRef.current = true
      tween.destroy()
      offOneFinger(oneFingerId)
    }
  }, [enabled, refreshId])
  const { current: apis } = apisRef
  const inited = !isNaN(contentContainerMarginTop)
  return (
    <div className="pull_downer" ref={ref}>
      <div
        className={`pull_downer_content_container ${
          inited ? '' : 'pull_downer--initing'
        }`}
        style={inited ? { marginTop: contentContainerMarginTop } : {}}>
        <div
          className="pull_downer_content_height_getter"
          ref={contentHeightGetterRef}>
          {content && content(apis)}
        </div>
      </div>
      <div className="pull_downer_children_container">
        {children && children(apis)}
      </div>
    </div>
  )
}
