import React from 'react'

export default class Price extends React.Component {
  render() {
    /**
     * classPrefix    String      总容器的className
     * realPrice      String   *  实际价，为空、转为数字时NaN等状况下不显示
     * linePrice      String      划线价，为空、实际价小于或等于划线价时，划线价不显示
     * decimal        Number      小数点后面补零位数，不填写默为不补零完全按原数据显示 如： decimal：2  [ 299 -> 299.00  39.9 -> 39.90 ]
     * currencySign   String      货币符，不填写默认不生成标签自己用CSS的:before或:after写 如: currencySign:'¥'  [¥100]
     * */

    let {
      props: { data = {}, conf = {} },
    } = this
    let {
      realPrice,
      linePrice,
      beforeRealPrice,
      afterRealPrice,
      beforeLinePrice,
      afterLinePrice,
    } = data
    let {
      classPrefix = 'jmdd-price',
      decimal,
      currencySign,
      forceViewLinePrice = 0,
    } = conf

    // 判断是否为数字
    let isNum = (value) => {
      return typeof value === 'number' && !window.isNaN(value)
    }

    // 实际价DOM
    let realPriceDom = null
    // 划线价DOM
    let linePriceDom = null
    // 转为数字
    let realPriceNum = parseFloat(realPrice)
    let linePriceNum = parseFloat(linePrice)

    let realPriceClass = classPrefix + '-real'
    let linePriceClass = classPrefix + '-line'

    // 数字处理
    let prices = (price) => {
      // 拆分小数
      let [int = '', dec = ''] = price.toString().split('.')

      // 小数补零
      if (decimal) {
        for (let i = 0; i < decimal; i++) {
          dec += dec[i] ? '' : '0'
        }
      }

      return { int, dec }
    }

    // 渲染节点
    let render = (className, { int, dec }, before, after) => {
      return (
        <p className={className}>
          {before}
          <span className={className + '-int'}>
            {currencySign ? (
              <span className={className + '-sign'}>{currencySign}</span>
            ) : null}
            {int}
          </span>
          {dec ? (
            <span className={className + '-dec'}>
              <span className={className + '-dot'}>.</span>
              {dec}
            </span>
          ) : null}
          {after}
        </p>
      )
    }

    // 两个价格都不为空时
    if (isNum(realPriceNum) && isNum(linePriceNum)) {
      // 实际价
      realPriceDom = render(
        realPriceClass,
        prices(realPrice),
        beforeRealPrice,
        afterRealPrice
      )

      // 实际价小于划线价时才划线价
      if (forceViewLinePrice || realPriceNum < linePriceNum) {
        linePriceDom = render(
          linePriceClass,
          prices(linePrice),
          beforeLinePrice,
          afterLinePrice
        )
      }
    } else {
      // 实际价非空时
      if (isNum(realPriceNum)) {
        realPriceDom = render(
          realPriceClass,
          prices(realPrice),
          beforeRealPrice,
          afterRealPrice
        )
      }

      // 划线价非空时
      if (forceViewLinePrice || isNum(linePriceNum)) {
        linePriceDom = render(
          linePriceClass,
          prices(linePrice),
          beforeLinePrice,
          afterLinePrice
        )
      }
    }

    return (
      <div className={classPrefix}>
        {realPriceDom}
        {linePriceDom}
      </div>
    )
  }
}
