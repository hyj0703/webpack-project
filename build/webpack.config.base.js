const path = require('path')
const ReplaceImportedImgsWebpackPlugin = require('./plugins/replace-imported-img-webpack-plugin')

module.exports = () => {
  return {
    entry: {
      base: ['core-js/stable', 'regenerator-runtime/runtime'],
      index: [
        path.resolve(__dirname, '../src/css/reset.scss'),
        path.resolve(__dirname, '../src/css/common.scss'),
        '@jmdd/jmdd-auto-rem',
        path.resolve(__dirname, '../src/js/index.jsx'),
        path.resolve(__dirname, '../src/css/index.scss'),
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [new ReplaceImportedImgsWebpackPlugin()],
  }
}
