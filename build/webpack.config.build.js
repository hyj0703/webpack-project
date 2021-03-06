const { merge } = require('webpack-merge')
const webpackConfigBase = require('./webpack.config.base')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const TinypngWebpackPlugin = require('./plugins/tinypng-webpack-plugin')
const tinypngKey = require('../tinypng-key.json')
const FilemanagerWebpackPlugin = require('filemanager-webpack-plugin')
const VconsoleWebpackPlugin = require('vconsole-webpack-plugin')
const genFileManagerWebpackPluginZipOpts = require('./utils/genFileManagerWebpackPluginZipOpts')
const GenHybridWebpackPlugin = require('./plugins/gen-hybrid-webpack-plugin')

module.exports = (...args) => {
  const [{ zip } = {}] = args
  return merge(webpackConfigBase(...args), {
    optimization: {
      minimizer: [
        new UglifyjsWebpackPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            compress: {
              drop_console: true,
              inline: false,
            },
          },
        }),
        new OptimizeCSSAssetsWebpackPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { reduceTransforms: false }],
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            // babelrcRoots: './',
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
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
              },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  config: path.resolve(__dirname, '../postcss.config.js'),
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: 'expanded',
                },
              },
            },
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
              }[name].[contenthash][ext]`
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
      filename: 'js/[name].[contenthash].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '',
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          path.resolve(__dirname, '../dist'),
          path.resolve(__dirname, '../src/img'),
        ],
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
      }),
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
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        },
        template: path.resolve(__dirname, '../src/index.html'),
      }),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer',
      }),
      new TinypngWebpackPlugin({
        ext: ['png', 'jpeg', 'jpg'],
        key: tinypngKey,
      }),
      new GenHybridWebpackPlugin(),
      new FilemanagerWebpackPlugin({
        events: {
          onEnd: [
            ...(zip ? genFileManagerWebpackPluginZipOpts('dist') : []), //??????dist.zip

            //start:??????hybrid???hybrid.zip
            {
              delete: [path.resolve(__dirname, '../hybrid')],
            }, //????????????hybrid
            {
              copy: [
                {
                  source: path.resolve(__dirname, '../dist/css'),
                  destination: path.resolve(__dirname, '../hybrid/css'),
                },
                {
                  source: path.resolve(__dirname, '../dist/js/base*'),
                  destination: path.resolve(__dirname, '../hybrid/js'),
                },
                {
                  source: path.resolve(__dirname, '../tmp_for_hybrid/index*'), //tmp_for_hybrid???GenHybridWebpackPlugin??????
                  destination: path.resolve(__dirname, '../hybrid/js'), //???tmp_for_hybrid??????index.js?????????dist/js??????index.js
                },
                {
                  source: path.resolve(__dirname, '../dist/index.html'),
                  destination: path.resolve(__dirname, '../hybrid/index.html'),
                },
              ],
            },
            {
              delete: [path.resolve(__dirname, '../tmp_for_hybrid')],
            }, //??????tmp_for_hybrid
            //end:??????hybrid???hybrid.zip

            ...(zip ? genFileManagerWebpackPluginZipOpts('hybrid') : []), //??????hybrid.zip
            { delete: [path.resolve(__dirname, '../src/img')] }, //??????src???img
          ],
        },
      }),
      new VconsoleWebpackPlugin({
        enable: false,
        filter: ['base'],
      }),
    ],
  })
}
