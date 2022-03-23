import PropTypes from 'prop-types'
import React, { Component, createRef } from 'react'
import Tween from '../../utils/Tween'

export default class AnimationNum extends Component {
  constructor(props) {
    super(props)
    const { initial, children } = props
    this.ref = createRef()
    this.tween = Tween.gen({
      num: Number(typeof initial === 'undefined' ? children : initial), //当前数值
    })
      .onUpdate(() => {
        const {
          ref: { current },
        } = this
        current.innerHTML = this.getPrecisionNum()
      })
      .onStop(() => {
        const {
          ref: { current },
          props: { children },
        } = this
        current.innerHTML = children
      })
  }

  /**
   * 获取保留小数位后的数值
   */
  getPrecisionNum() {
    const {
      props: { precision },
      tween,
    } = this
    let [integer = '', decimal = ''] = String(tween.obj.num).split('.')
    if (precision >= 0) {
      if (decimal) {
        decimal = decimal.slice(0, precision)
      }
    } else {
      if (integer) {
        integer = integer.slice(0, integer.length + precision)
        for (let i = 0, len = -precision; i < len; i++) {
          integer += '0'
        }
      }
      decimal = ''
    }
    return Number(`${integer}${decimal ? '.' : ''}${decimal}`)
  }

  /**
   * 更新数值
   */
  updateNum() {
    const {
      tween,
      props: { children, duration, cubicBezier },
    } = this
    const {
      obj: { num },
    } = tween
    const newNum = Number(children)
    if (newNum !== num) {
      tween.to({ num: newNum }, duration, cubicBezier).start()
    }
  }

  componentDidMount() {
    this.updateNum()
  }

  componentDidUpdate() {
    this.updateNum()
  }

  componentWillUnmount() {
    const { tween } = this
    tween.destroy()
  }

  render() {
    const {
      props: { tag: Tag, initial, duration, cubicBezier, precision, ...props },
      ref,
    } = this
    return <Tag ref={ref} {...props}></Tag>
  }

  static propTypes = {
    tag: PropTypes.string, //标签类型
    initial: PropTypes.number, //初始数值
    duration: PropTypes.number, //过渡时间（单位：毫秒）
    cubicBezier: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.number),
    ]), //贝塞尔函数参数组成的数组
    precision: PropTypes.number, //保留小数位数
  }

  static defaultProps = {
    tag: 'span',
    duration: 1000,
    cubicBezier: 'ease',
    precision: 0,
  }
}
