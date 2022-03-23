/**
 * @module CubicBezier
 * @version 0.0.0
 * @see {@link https://trac.webkit.org/browser/trunk/Source/WebCore/platform/graphics/UnitBezier.h}
 *
 * @example
 * 计算中间2个控制点为(0.3,-0.6)和(0.9,1.2)的三次贝塞尔曲线，x为0.5时的值
 new CubicBezier(.3,-.6,.9,1.2).solve(.5);
 *
 * @example
 * 创建类型为ease-in-out的三次贝塞尔曲线对象（以下2种方式均可）
 CubicBezier.gen('easeInOut');
 CubicBezier.genCommon('easeInOut');
 *
 * @example
 * 将字符串'0.3,-0.6,0.9,1.2'转换为三次贝塞尔曲线对象
 CubicBezier.gen('0.3,-0.6,0.9,1.2');
 *
 * @example
 * 将字符串'cubic-bezier(0.3,-0.6,0.9,1.2)'转换为三次贝塞尔曲线对象
 CubicBezier.gen('cubic-bezier(0.3,-0.6,0.9,1.2)');
 *
 * @example
 * 将数组[0.3,-0.6,0.9,1.2]转换为三次贝塞尔曲线对象
 CubicBezier.gen([0.3,-0.6,0.9,1.2]);
 */

/**
 * 三次贝塞尔函数类（第一个控制点和最后一个控制点为(0,0)和(1,1)）
 * @class module:CubicBezier~CubicBezier
 */
export default class CubicBezier {
  /**
   * 构造函数
   * @param {Number} x0 - x0
   * @param {Number} y0 - y0
   * @param {Number} x1 - x1
   * @param {Number} y1 - y1
   * @param {Number} [defaultEps = CubicBezier.DEFAULT_EPS] - 默认的精度
   */
  constructor(x0, y0, x1, y1, defaultEps = CubicBezier.DEFAULT_EPS) {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
    this.defaultEps = defaultEps

    //start:计算多项式参数（使用“霍纳法则”展开）
    this.cx = 3 * x0
    this.bx = 3 * (x1 - x0) - this.cx
    this.ax = 1 - this.cx - this.bx
    this.cy = 3 * y0
    this.by = 3 * (y1 - y0) - this.cy
    this.ay = 1 - this.cy - this.by
    //end:计算多项式参数（使用“霍纳法则”展开）
  }

  /**
   * x参数方程
   * @param {Number} t - 参数
   * @returns {Number} x
   */
  curveX(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t
  }

  /**
   * y参数方程
   * @param {Number} t - 参数
   * @returns {Number} y
   */
  curveY(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t
  }

  /**
   * x参数方程的导数
   * @param {Number} t - 参数
   * @returns {Number} dx
   */
  curveDx(t) {
    return (3 * this.ax * t + 2 * this.bx) * t + this.cx
  }

  /**
   * 求解x参数方程的参数
   * @param {Number} x - x
   * @param {Number} [eps = this.defaultEps] - 精度
   * @returns {Number} 参数
   */
  solveCurveX(x, eps = this.defaultEps) {
    let t = x
    let tmpX

    //start:先使用牛顿切线法求解
    let dx
    for (let i = 0; i < 8; i++) {
      tmpX = this.curveX(t) - x
      if (Math.abs(tmpX) < eps) {
        return t
      }
      dx = this.curveDx(t)
      if (Math.abs(dx) < 1e-6) {
        break
      }
      t = t - tmpX / dx
    }
    //end:先使用牛顿切线法求解

    //start:若使用牛顿切线法求解失败，则使用二分法求解
    let tmpT0 = 0
    let tmpT1 = 1
    t = x
    if (t < tmpT0) {
      return tmpT0
    }
    if (t > tmpT1) {
      return tmpT1
    }
    while (tmpT0 < tmpT1) {
      tmpX = this.curveX(t)
      if (Math.abs(tmpX - x) < eps) {
        return t
      }
      if (x > tmpX) {
        tmpT0 = t
      } else {
        tmpT1 = t
      }
      t = (tmpT1 - tmpT0) * 0.5 + tmpT0
    }
    //end:若使用牛顿切线法求解失败，则使用二分法求解

    return t //若使用牛顿切线法和二分法均求解失败，则返回最终求解到的t
  }

  /**
   * 求解x对应的y
   * @param {Number} x - x
   * @param {Number} [eps = this.defaultEps] - 精度
   * @returns {Number} y
   */
  solve(x, eps = this.defaultEps) {
    return this.curveY(this.solveCurveX(x, eps))
  }

  /**
   * 创建常用贝塞尔函数的cubicBezier对象
   * @param {String} type - 类型
   * @param {Number} [defaultEps = CubicBezier.DEFAULT_EPS] - 默认的精度
   * @returns {module:CubicBezier~CubicBezier | null} 创建的贝塞尔函数（若指定的类型不存在，则返回null）
   */
  static genCommon(type, defaultEps = CubicBezier.DEFAULT_EPS) {
    const common = CubicBezier.COMMONS[type]
    return common ? new CubicBezier(...common, defaultEps) : null
  }

  /**
   * “常用贝塞尔函数名称的字符串”或“形如‘0,0.5,1,1.5’的字符串”或“形如‘cubic-bezier(0,0.5,1,1.5)’的字符串”或“形如‘[0,0.5,1,1.5]’的控制点坐标组成的数组”
   * @typedef {String | Number[]} module:CubicBezier~genType
   */

  /**
   * 创建cubicBezier对象
   * @param {module:CubicBezier~genType} type - 类型
   * @param {Number} [defaultEps = CubicBezier.DEFAULT_EPS] - 默认的精度
   * @returns {module:CubicBezier~CubicBezier | null} 创建的贝塞尔函数（若指定的类型不存在，则返回null）
   */
  static gen(type, defaultEps = CubicBezier.DEFAULT_EPS) {
    if (typeof type === 'string') {
      const match = type
        .replace(/\s+/g, '')
        .match(/^(?:cubic-bezier\()?((?:[\d.]+,){3}[\d.]+)\)?/)
      if (match) {
        const ps = match[1].split(',').map((p) => Number(p)) //控制点坐标
        return new CubicBezier(...ps, defaultEps)
      } else {
        return CubicBezier.genCommon(type, defaultEps)
      }
    } else {
      return new CubicBezier(...type, defaultEps)
    }
  }

  static DEFAULT_EPS = 1e-5 //默认的精度
  static COMMONS = {
    linear: [0.25, 0.25, 0.75, 0.75],
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    easeInQuad: [0.55, 0.085, 0.68, 0.53],
    easeInCubic: [0.55, 0.055, 0.675, 0.19],
    easeInQuart: [0.895, 0.03, 0.685, 0.22],
    easeInQuint: [0.755, 0.05, 0.855, 0.06],
    easeInSine: [0.47, 0, 0.745, 0.715],
    easeInExpo: [0.95, 0.05, 0.795, 0.035],
    easeInCirc: [0.6, 0.04, 0.98, 0.335],
    easeInBack: [0.6, -0.28, 0.735, 0.045],
    easeOutQuad: [0.25, 0.46, 0.45, 0.94],
    easeOutCubic: [0.215, 0.61, 0.355, 1],
    easeOutQuart: [0.165, 0.84, 0.44, 1],
    easeOutQuint: [0.23, 1, 0.32, 1],
    easeOutSine: [0.39, 0.575, 0.565, 1],
    easeOutExpo: [0.19, 1, 0.22, 1],
    easeOutCirc: [0.075, 0.82, 0.165, 1],
    easeOutBack: [0.175, 0.885, 0.32, 1.275],
    easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
    easeInOutCubic: [0.645, 0.045, 0.355, 1],
    easeInOutQuart: [0.77, 0, 0.175, 1],
    easeInOutQuint: [0.86, 0, 0.07, 1],
    easeInOutSine: [0.445, 0.05, 0.55, 0.95],
    easeInOutExpo: [1, 0, 0, 1],
    easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
    easeInOutBack: [0.68, -0.55, 0.265, 1.55],
  } //常用贝塞尔函数的控制点参数
}
