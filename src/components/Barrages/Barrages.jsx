import { prefix } from '@jmdd/jmdd-prefix'
import React, { useEffect, useRef } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './Barrages.scss'
import BarragesContext from './BarragesContext'

export default withErrorBoundary()(function Barrages({
  speed = 50, //速度（单位：像素/秒）
  firstIgnoreHSpacing = 'disable', //是否首个弹幕忽略水平间隔（可能的值：'ignore'-忽略；'row'-按每行首个弹幕忽略；'disable'-不忽略）
  minHSpacing = 0, //最小水平间隔（单位：像素）
  maxHSpacing = 0, //最大水平间隔（单位：像素）
  vSpacing = 0, //垂直间隔（单位：像素）（当指定了rowHeight时，该参数无效）
  rowHeight = null, //行高（单位：像素）（若为null，则表示自动计算）

  children,
  className = '',
  ...props
}) {
  const ref = useRef()
  const { current: contextVal } = useRef({
    mounted: false, //是否已挂载
    inited: false, //是否已初始化
    addedBarrage: false, //是否已添加过弹幕
    barragesHeight: null, //barrages的高度（单位：像素）
    barragesWidth: null, //barrages的宽度（单位：像素）
    rowNum: null, //行数
    vInterval: null, //行与行之间的垂直间隔（单位：像素）
    rowMapToHEndInfo: null, //行数到水平结束位置信息的映射
    barrageRefs: [], //barrage的ref组成的数组
    requireUpdateBarrageRefs: [], //需要更新的barrage的ref组成的数组

    /**
     * 获取行高
     * @returns {Number} 行高（单位：像素）
     */
    getRowHeight() {
      if (rowHeight > 0) {
        return rowHeight
      } else {
        const { barrageRefs } = contextVal
        let minVerticalInterval = -Infinity
        barrageRefs.forEach((barrageRef) => {
          const { offsetHeight: barrageHeight } = barrageRef
          minVerticalInterval = Math.max(minVerticalInterval, barrageHeight)
        })
        return minVerticalInterval + vSpacing
      }
    },

    /**
     * 初始化
     */
    init() {
      const {
        current: { offsetHeight: barragesHeight, offsetWidth: barragesWidth },
      } = ref
      const { getRowHeight } = contextVal
      const rowNum = Math.floor(barragesHeight / getRowHeight()) || 1
      const vInterval = barragesHeight / rowNum
      const rowMapToHEndInfo = (() => {
        const ret = []
        const now = new Date()
        for (let i = 0, len = rowNum; i < len; i++) {
          ret.push({
            row: i, //行数
            hEnd: 0, //水平结束位置（单位：像素）
            updateTime: now, //更新时间
            addedBarrage: false, //当前行是否已添加过弹幕
          })
        }
        return ret
      })()
      contextVal.barragesHeight = barragesHeight
      contextVal.barragesWidth = barragesWidth
      contextVal.rowNum = rowNum
      contextVal.vInterval = vInterval
      contextVal.rowMapToHEndInfo = rowMapToHEndInfo
      contextVal.inited = true
    },

    /**
     * 检测是否需要初始化
     */
    chkInit() {
      const {
        inited,
        barrageRefs: { length },
        init,
      } = contextVal
      if (!inited && length) {
        init()
      }
    },

    /**
     * 检测是否需要在挂载后初始化
     */
    chkInitAfterMounted() {
      const { mounted, chkInit } = contextVal
      if (mounted) {
        chkInit()
      }
    },

    /**
     * 注册barrage的ref
     * @param {HTMLElement} barrageRef - barrage的ref
     */
    registBarrageRef(barrageRef) {
      const { barrageRefs, requireUpdateBarrageRefs, chkInitAfterMounted } =
        contextVal
      barrageRefs.push(barrageRef)
      requireUpdateBarrageRefs.push(barrageRef)
      chkInitAfterMounted()
    },

    /**
     * 注销barrage的ref
     * @param {HTMLElement} barrageRef - barrage的ref
     */
    unregistBarrageRef(barrageRef) {
      {
        const { barrageRefs } = contextVal
        const idx = barrageRefs.indexOf(barrageRef)
        if (~idx) {
          barrageRefs.splice(idx, 1)
        }
      }
      {
        const { requireUpdateBarrageRefs } = contextVal
        const idx = requireUpdateBarrageRefs.indexOf(barrageRef)
        if (~idx) {
          requireUpdateBarrageRefs.splice(idx, 1)
        }
      }
    },

    /**
     * 获取最小的水平结束位置的水平结束位置信息
     * @returns {Number} 最小的水平结束位置的水平结束位置信息
     */
    getMinHEndInfo() {
      const { rowMapToHEndInfo } = contextVal
      let minHEnd = Infinity
      let ret = null
      rowMapToHEndInfo.forEach((hEndInfo) => {
        const { hEnd, updateTime } = hEndInfo
        const now = new Date()
        hEndInfo.hEnd = Math.max(hEnd - ((now - updateTime) / 1000) * speed, 0)
        hEndInfo.updateTime = now
      })
      rowMapToHEndInfo.forEach((hEndInfo) => {
        const { hEnd } = hEndInfo
        if (hEnd < minHEnd) {
          minHEnd = hEnd
          ret = hEndInfo
        } else if (hEnd === minHEnd) {
          if (Math.random() > 0.5) {
            minHEnd = hEnd
            ret = hEndInfo
          }
        }
      })
      return ret
    },

    /**
     * 生成水平间隔
     * @returns {Number} 水平间隔
     */
    genHSpacing() {
      return Math.floor(
        minHSpacing + Math.random() * (maxHSpacing - minHSpacing)
      )
    },

    /**
     * 更新barrage的ref
     * @param {HTMLElement} barrageRef - 要更新的barrage的ref
     */
    updateBarrageRef({
      offsetWidth: barrageWidth,
      offsetHeight: barrageHeight,
      style,
    }) {
      const {
        getMinHEndInfo,
        addedBarrage,
        genHSpacing,
        barragesWidth,
        vInterval,
      } = contextVal
      const hEndInfo = getMinHEndInfo()
      const { addedBarrage: rowAddedBarrage } = hEndInfo
      hEndInfo.hEnd +=
        (firstIgnoreHSpacing === 'ignore' && !addedBarrage) ||
        (firstIgnoreHSpacing === 'row' && !rowAddedBarrage)
          ? 0
          : genHSpacing()
      contextVal.addedBarrage = true
      hEndInfo.addedBarrage = true
      const { hEnd, row } = hEndInfo
      hEndInfo.hEnd += barrageWidth
      style[`${prefix.animation}Name`] =
        style[`${prefix.animation}Name`] === 'barrageOddShow'
          ? 'barrageEvenShow'
          : 'barrageOddShow'
      style[`${prefix.animation}Delay`] = `${hEnd / speed}s`
      style[`${prefix.animation}Duration`] = `${
        (barragesWidth + barrageWidth) / speed
      }s`
      style.top = `${vInterval * row + (vInterval - barrageHeight) / 2}px`
    },
  })
  useEffect(() => {
    const { updateBarrageRef, chkInit, requireUpdateBarrageRefs } = contextVal

    /**
     * 当动画播放完成时的处理函数
     */
    function onAnimationEnd({ animationName, target }) {
      if (
        animationName === 'barrageOddShow' ||
        animationName === 'barrageEvenShow'
      ) {
        updateBarrageRef(target)
      }
    }

    chkInit()
    contextVal.mounted = true

    requireUpdateBarrageRefs.forEach(updateBarrageRef)
    contextVal.requireUpdateBarrageRefs = []

    const { current } = ref
    current.addEventListener(prefix.animationEnd, onAnimationEnd)
    return () =>
      current.removeEventListener(prefix.animationEnd, onAnimationEnd)
  }, [children])
  return (
    <BarragesContext.Provider value={contextVal}>
      <div className={`barrages ${className}`} ref={ref} {...props}>
        {children}
      </div>
    </BarragesContext.Provider>
  )
})
