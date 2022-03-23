/**
 * @module Tween
 * @version 0.0.0
 *
 * @example
 * 将对象objA创建为tween对象
 Tween.gen(objA);
 *
 * @example
 * 将属性x过渡到100，将属性y过渡到-200，过渡时间1000毫秒，过渡函数为2个控制点为(0.3,-0.6)和(0.9,1.2)的三次贝塞尔曲线
 Tween.gen({
		x : 0, //这里无所谓x的起始值
		y : 0 //这里无所谓y的起始值
	}).to(
 {
			x : 100,
			y : -200
		},
 1000,
 [.3,-.6,.9,1.2]
 ).start(); //调用start方法后，过渡才会开始
 *
 * @example
 * 在上个例子的基础上添加过渡开始、过渡停止、过渡更新、过渡完成的回调
 Tween.gen({
		x : 0, //这里无所谓x的起始值
		y : 0 //这里无所谓y的起始值
	}).to(
 {
			x : 100,
			y : -200
		},
 1000,
 [.3,-.6,.9,1.2]
 ).onStart(() => {
		console.log('onStart'); //过渡开始
	}).onStop(() => {
		console.log('onStop'); //过渡停止
	}).onUpdate(() => {
		console.log('onUpdate'); //过渡更新，过渡过程中每一帧都会调用这个回调
	}).onComplete(() => {
		console.log('onComplete'); //过渡完成
	}).start();
 *
 * @example
 * 停止tween对象的过渡
 tween.stop();
 *
 * @example
 * 销毁创建的tween对象
 tween.destroy();
 */

import { loop, stop } from '@jmdd/jmdd-raf'
import CbMgr from './CbMgr'
import CubicBezierByDur from './CubicBezierByDur'

const tweens = [] //实例化的tween组成的数组
let loopId = null //过渡的loopId

/**
 * “过渡”类
 * @class module:Tween~Tween
 */
export default class Tween extends CbMgr {
  /**
   * 构造函数
   * @param {Object} opts - 参数
   *    @param {Object} opts.obj - 相关对象
   */
  constructor({ obj }) {
    super()
    this.obj = obj

    this.toProps = null //要过渡到的属性组成的对象
    this.duration = NaN //过渡时长（单位：毫秒）
    this.cubicBezier = CubicBezierByDur.genCommon('ease') //贝塞尔函数
    this.started = false //是否已开始
    this.elasped = NaN //已经过的时间（单位：毫秒）
    this.fromProps = null //起始属性值组成的对象
    this.offsetProps = null //偏移属性值组成的对象

    tweens.push(this)
  }

  /**
   * 销毁
   */
  destroy() {
    this.stop()
    const idx = tweens.indexOf(this)
    if (~idx) {
      tweens.splice(idx, 1)
    }
    return this
  }

  /**
   * 过渡到
   * @param {Object} [toProps] - 要过渡到的属性组成的对象
   * @param {Number} [duration] - 过渡时长（单位：毫秒）
   * @param {module:CubicBezier~genType} [cubicBezierParams] - 贝塞尔函数参数组成的数组
   */
  to(toProps, duration, cubicBezierParams) {
    if (Array.isArray(toProps) || typeof toProps === 'string') {
      cubicBezierParams = toProps
      duration = NaN
      toProps = null
    } else if (typeof toProps === 'number') {
      cubicBezierParams = duration
      duration = toProps
      toProps = null
    } else if (Array.isArray(duration) || typeof duration === 'string') {
      cubicBezierParams = duration
      duration = NaN
    }
    this.toProps = toProps || this.toProps
    this.duration = duration = duration || this.duration
    this.cubicBezier = cubicBezierParams
      ? CubicBezierByDur.gen(cubicBezierParams, duration)
      : this.cubicBezier.updateDur(duration)
    return this
  }

  /**
   * 更新fromProps
   */
  updateFromProps() {
    const { toProps, obj } = this
    const fromProps = {}
    for (let i in toProps) {
      fromProps[i] = obj[i]
    }
    this.fromProps = fromProps
    return this
  }

  /**
   * 更新offsetProps
   */
  updateOffsetProps() {
    const { toProps, fromProps } = this
    const offsetProps = {}
    for (let i in toProps) {
      offsetProps[i] = toProps[i] - fromProps[i]
    }
    this.offsetProps = offsetProps
    return this
  }

  /**
   * 开始
   */
  start() {
    this.started = true
    this.elasped = 0
    this.updateFromProps().updateOffsetProps().callStart()
    if (!loopId) {
      loopId = loop((interval) => {
        tweens.forEach((tween) => {
          const { started } = tween
          if (started) {
            tween.elasped += interval
            const {
              elasped,
              duration,
              cubicBezier,
              obj,
              fromProps,
              offsetProps,
            } = tween
            const progress = Math.min(elasped / duration, 1)
            const percent = cubicBezier.solve(progress)
            for (let i in fromProps) {
              obj[i] = fromProps[i] + offsetProps[i] * percent
            }
            tween.callUpdate()
            if (progress >= 1) {
              tween.stop().callComplete()
            }
          }
        })
      })
    }
    return this
  }

  /**
   * 停止
   */
  stop() {
    this.started = false
    this.callStop()
    if (!tweens.some((tween) => tween.started)) {
      stop(loopId)
      loopId = null
    }
    return this
  }

  /**
   * 生成tween
   * @param {Object} obj - 相关对象
   * @returns {module:Tween~Tween} 生成的tween
   */
  static gen(obj) {
    return new Tween({
      obj: obj,
    })
  }
}

Tween.addCb(['start', 'stop', 'update', 'complete']) //添加回调相关方法
