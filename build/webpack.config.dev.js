const portfinder = require('portfinder')
const { basePort, host } = require('./config')
const { merge } = require('webpack-merge')
const path = require('path')
const webpackConfigBase = require('./webpack.config.base')
const {
  genFunctionIdMapToMockedInfoJson,
  watchMockChange,
} = require('./plugins/mock/utils')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const VconsoleWebpackPlugin = require('vconsole-webpack-plugin')

module.exports = (...args) => {
  const [{ open } = {}] = args
  portfinder.basePort = basePort
  return portfinder.getPortPromise().then((port) => {
    return merge(
      {
        entry: {
          base: [path.resolve(__dirname, './plugins/mock/xhr.js')],
        },
      },
      webpackConfigBase(...args),
      {
        devServer: {
          allowedHosts: 'all',
          static: {
            directory: path.join(__dirname, '../src'),
            watch: {
              ignored: /node_modules/,
            },
          },
          host,
          onBeforeSetupMiddleware() {
            genFunctionIdMapToMockedInfoJson()
            watchMockChange()
          },
          open,
          port,
        },
        devtool: 'eval-cheap-module-source-map',
        module: {
          rules: [
            {
              test: /\.(j|t)sx?$/,
              exclude: /node_modules/,
              loader: 'ts-loader',
              options: {
                // babelrcRoots: path.resolve(__dirname, '../'),
              },
            },
            {
              enforce: 'pre',
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'source-map-loader',
            },
            {
              test: /\.s?css$/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 2,
                    sourceMap: true,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      config: path.resolve(__dirname, '../postcss.config.js'),
                    },
                    sourceMap: true,
                  },
                },
                'sass-loader',
              ],
            },
            {
              test: /\.(jpe?g|png|gif|svg)$/,
              type: 'asset/resource',
              generator: {
                filename: ({ module: { resource } }) => {
                  const [first, second] = path
                    .dirname(resource)
                    .split(path.sep)
                    .reverse()
                  return `img/${
                    first === 'nosprite' ? `nosprite.${second}.` : ''
                  }[name][ext]`
                },
              },
            },
            {
              test: /\.(eot|otf|ttf|woff2?)$/,
              type: 'asset/resource',
              generator: {
                filename: 'plugin/[name].[ext]',
              },
            },
          ],
        },
        output: {
          filename: 'js/[name].js',
          path: path.resolve(__dirname, '../dist'),
          publicPath: '',
        },
        plugins: [
          new CopyWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, '../src/plugin'),
                to: 'plugin',
                globOptions: {
                  ignore: ['.gitkeep'],
                },
              },
            ],
          }),
          new HtmlWebpackPlugin({
            chunks: ['base', 'index'],
            chunksSortMode: 'manual',
            template: path.resolve(__dirname, '../src/index.html'),
          }),
          new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer',
          }),
          new VconsoleWebpackPlugin({
            enable: true,
            filter: ['base'],
          }),
        ],
      }
    )
  })
}
