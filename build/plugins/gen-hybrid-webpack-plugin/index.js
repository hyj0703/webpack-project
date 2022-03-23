const path = require('path')
const fs = require('fs')
const replace = require('replace-in-file')

class GenHybridWebpackPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise('GenHybridWebpackPlugin', async () => {
      const rootPath = path.resolve(__dirname, '../../../')
      const files = fs.readdirSync(path.resolve(rootPath, './dist/js'))
      for (let file of files) {
        if (file.match(/^index/)) {
          const sourcePath = path.resolve(rootPath, `./dist/js/${file}`)
          const targetFile = path.resolve(rootPath, './tmp_for_hybrid')
          const targetPath = path.resolve(targetFile, `./${file}`)
          fs.mkdirSync(targetFile, { recursive: true })
          fs.copyFileSync(sourcePath, targetPath)
          await replace({
            files: targetPath,
            from: /window\.VERSION_TAG_HYBRID/g,
            to: "'hybrid'",
          })
          break
        }
      }
    })
  }
}
module.exports = GenHybridWebpackPlugin
