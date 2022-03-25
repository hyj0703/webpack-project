# 添加 typescript 的流程

## 一，安装 npm 插件

```javascript
npm i -D typescript ts-loader source-map-loader
npm i -S @types/react @types/react-dom
```

## 二，添加配置文件 tsconfig.json

```javascript
{
  "compilerOptions": {
    "outDir": "./dist/", // 输出目录的路径
    "sourceMap": true, // 允许 sourcemap 支持
    "strictNullChecks": true, // 启用严格的空检查作为最佳实践
    "module": "es6", // 指定模块代码生成
    "jsx": "react", // 使用 typescript 将 jsx 转换为 js
    "target": "es5", // 指定 ECMAScript 目标版本
    "allowJs": true, // 允许部分 TypeScript 和 JavaScript 代码库
    "esModuleInterop": true,
    "moduleResolution": "Node"
  },
  "include": ["./src/"]
}

```

## 三，修改 webpack.config 文件

```javascript
module.exports = {
  // change to .tsx if necessary
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' }, exclude: /node_modules/ },
      {
        test: /\.(t|j)sx?$/,
        use: { loader: 'ts-loader' },
        exclude: /node_modules/,
      },

      // addition - add source-map support
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  // addition - add source-map support
  devtool: 'source-map',
}
```

## 四，添加 store 定义

```javascript
// /store/store.d.ts
import store from './index'

//Redux 应用的状态
export type RootState = ReturnType<typeof store.getState>
// ReturnType: thunk action 的返回类型，项目中几乎都是返回Promise
```

## 五，添加 store 在 connect 的数据定义

```javascript
// /src/components/Pk/index.tsx
import { RootState } from '../../store/store'


export default connect(
  (store: RootState) => {
    const { pk } = store
    return { pk }
  },
  ()={})()
```

## 六，修改 saga 文件判断

```javascript
// /src/actions/utils.js
/**
 * 是否是generator函数
 * @param {*} obj
 * @returns {Boolean} 是否是generator函数
 */
function isGeneratorFunction(fn) {
  const { constructor } = fn
  if (!constructor) {
    return false
  }
  const { name, displayName } = constructor
  if (name === 'GeneratorFunction' || displayName === 'GeneratorFunction') {
    return true
  }
  const { prototype } = constructor
  if (
    typeof prototype.next === 'function' &&
    typeof prototype.throw === 'function'
  ) {
    return true
  }
  const generatorFn = fn.toString().indexOf('_generator')
  if (generatorFn !== -1) {
    return true
  }
}
```
