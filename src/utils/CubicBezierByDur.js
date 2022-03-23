/**
 * @module CubicBezierByDur
 * @version 0.0.1
 * @see {@link https://opensource.apple.com/source/WebCore/WebCore-5525.18.1/page/AnimationController.cpp}
 *
 * @example
 * 计算中间2个控制点为(0.3,-0.6)和(0.9,1.2)、时长为500毫秒的三次贝塞尔曲线，时间为150毫秒时的值
 new CubicBezierByDur(.3,-.6,.9,1.2,500).solve(150 / 500);
 *
 * @example
 * 创建类型为ease-in-out、时长为500毫秒的三次贝塞尔曲线对象（以下2种方式均可）
 CubicBezierByDur.gen('easeInOut',500);
 CubicBezierByDur.genCommon('easeInOut',500);
 *
 * @example
 * 将字符串'0.3,-0.6,0.9,1.2'转换为时长为500毫秒的三次贝塞尔曲线对象
 CubicBezierByDur.gen('0.3,-0.6,0.9,1.2',500);
 *
 * @example
 * 将字符串'cubic-bezier(0.3,-0.6,0.9,1.2)'转换为时长为500毫秒的三次贝塞尔曲线对象
 CubicBezierByDur.gen('cubic-bezier(0.3,-0.6,0.9,1.2)',500);
 *
 * @example
 * 将数组[0.3,-0.6,0.9,1.2]转换为时长为500毫秒的三次贝塞尔曲线对象
 CubicBezierByDur.gen([0.3,-0.6,0.9,1.2],500);
 */

import CubicBezier from './CubicBezier'

/**
 * 由时长定义的三次贝塞尔函数（第一个控制点和最后一个控制点为(0,0)和(1,1)）
 * @class module:CubicBezierByDur~CubicBezierByDur
 * @augments module:CubicBezier~CubicBezier
 */
export default class CubicBezierByDur extends CubicBezier {
  /**
   * 构造函数
   * @param {Number} x0 - x0
   * @param {Number} y0 - y0
   * @param {Number} x1 - x1
   * @param {Number} y1 - y1
   * @param {Number} [dur = null] - 时长（单位：毫秒）（为null时，精度为CubicBezierByDur类的默认精度）
   */
  constructor(x0, y0, x1, y1, dur = null) {
    super(x0, y0, x1, y1)
    this.updateDur(dur)
  }

  /**
   * 根据时长更新默认进度
   */
  updateDefaultEps() {
    const dur = this.dur
    if (dur) {
      this.defaultEps = 1 / (200 * dur)
    } else {
      this.defaultEps = CubicBezierByDur.DEFAULT_EPS
    }
    return this
  }

  /**
   * 更新时长
   * @param {Number} [dur = null] - 时长（单位：毫秒）（为null时，精度为CubicBezierByDur类的默认精度）
   */
  updateDur(dur = null) {
    this.dur = dur
    return this.updateDefaultEps()
  }

  /**
   * 创建常用贝塞尔函数的cubicBezierByDur对象
   * @param {String} type - 类型
   * @param {Number} [dur = null] - 时长（单位：毫秒）（为null时，精度为CubicBezierByDur类的默认精度）
   * @returns {module:CubicBezierByDur~CubicBezierByDur | null} 创建的贝塞尔函数（若指定的类型不存在，则返回null）
   */
  static genCommon(type, dur = null) {
    const common = CubicBezierByDur.COMMONS[type]
    return common ? new CubicBezierByDur(...common, dur) : null
  }

  /**
   * 创建cubicBezierByDur对象
   * @param {module:CubicBezier~genType} type - 类型
   * @param {Number} [dur = null] - 时长（单位：毫秒）（为null时，精度为CubicBezierByDur类的默认精度）
   * @returns {module:CubicBezierByDur~CubicBezierByDur | null} 创建的贝塞尔函数（若指定的类型不存在，则返回null）
   */
  static gen(type, dur = null) {
    if (typeof type === 'string') {
      const match = type
        .replace(/\s+/g, '')
        .match(/^(?:cubic-bezier\()?((?:[\d.]+,){3}[\d.]+)\)?/)
      if (match) {
        const ps = match[1].split(',').map((p) => Number(p)) //控制点坐标
        return new CubicBezierByDur(...ps, dur)
      } else {
        return CubicBezierByDur.genCommon(type, dur)
      }
    } else {
      return new CubicBezierByDur(...type, dur)
    }
  }
}
