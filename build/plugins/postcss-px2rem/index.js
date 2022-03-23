const Px2rem = require('px2rem')

module.exports = (opts) => ({
  postcssPlugin: 'postcss-dark-theme-class',
  Once(css, { result, parse }) {
    const oldCssText = css.toString()
    const px2remIns = new Px2rem(opts)
    const newCssText = px2remIns.generateRem(oldCssText)
    const newCssObj = parse(newCssText)
    result.root = newCssObj
  },
})
module.exports.postcss = true
