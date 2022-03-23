const path = require('path')

class ReplaceImgsWebpackPlugin {
  apply({ hooks: { emit } }) {
    emit.tap('ReplaceImgsWebpackPlugin', ({ assets }) => {
      const componentNameMapToImgs = {}
      const jss = []
      for (let src in assets) {
        const extname = path.extname(src)
        switch (extname) {
          case '.js':
            jss.push(src)
            break
          case '.jpg':
          case '.jpeg':
          case '.png':
          case '.gif':
          case '.svg':
            const [, componentName] = path.basename(src, extname).split('.')
            const imgs = (componentNameMapToImgs[componentName] =
              componentNameMapToImgs[componentName] || [])
            imgs.push(src) //TODO 这里build模式的图片输出并没有做特殊处理，只是因为通天塔替换img文件路径的特殊规则，才没有出错。以后需要考虑如何处理。
            break
        }
      }
      jss.forEach((src) => {
        const { [src]: asset } = assets
        const newSource = asset
          .source()
          .replace(/IMPORTED_IMGS_([a-zA-Z\d]+)/g, (str, componentName) => {
            const { [componentName]: imgs = [] } = componentNameMapToImgs
            return JSON.stringify(imgs).replace(/"/g, "'")
          })
        assets[src] = {
          source() {
            return newSource
          },
          size() {
            return newSource.length
          },
        }
      })
    })
  }
}
module.exports = ReplaceImgsWebpackPlugin
