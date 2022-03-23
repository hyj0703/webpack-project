const srcMapToLoadPromise = {} //图片地址到加载promise的映射

/**
 * 加载单张图片
 * @param {Object} [opts = {}] - 参数
 *    @param {String[]} opts.src - 要加载图片地址
 *    @param {Number} [opts.timeout = 10000] - 加载超时时间
 *    @param {Boolean} [opts.slience = true] - 是否静默失败
 *    @param {Boolean} [opts.retryable = false] - 是否加载失败的图片是否可重试
 * @returns {Promise} 加载完成（resolve表示成功；reject表示失败）
 */
function loadImg({ src, timeout = 10000, slience = true, retryable = false }) {
  if (src) {
    return (srcMapToLoadPromise[src] =
      srcMapToLoadPromise[src] ||
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          clearTimeout(t)
          resolve()
        }
        img.onerror = () => {
          clearTimeout(t)
          if (retryable) {
            delete srcMapToLoadPromise[src]
          }
          if (slience) {
            resolve()
          } else {
            reject()
          }
        }
        const t = setTimeout(() => {
          img.onload = img.onerror = null
          if (retryable) {
            delete srcMapToLoadPromise[src]
          }
          if (slience) {
            resolve()
          } else {
            reject()
          }
        }, timeout)
        img.src = src
      }))
  } else {
    return Promise[slience ? 'resolve' : 'reject']()
  }
}

/**
 * 当一张图片加载完成时的处理函数的参数
 * @typedef {Object} onOneLoadOpts
 * @property {String} src - 加载完成的图片地址
 * @property {Number} loaded - 加载完成的图片数量
 * @property {Number} total - 需要加载的总的图片数量
 */

/**
 * 当一张图片加载完成时的处理函数
 * @callback onOneLoad
 * @param {onOneLoadOpts} opts - 当一张图片加载完成时的处理函数的参数
 */

/**
 * 加载图片
 * @param {Object} [opts = {}] - 参数
 *    @param {String[]} [opts.srcs = []] - 要加载图片地址组成的数组
 *    @param {Number} [opts.timeout = 10000] - 加载超时时间（单位：毫秒）
 *    @param {Boolean} [opts.slience = true] - 是否静默失败
 *    @param {Boolean} [opts.retryable = false] - 是否加载失败的图片是否可重试
 *    @param {onOneLoad} [onOneLoad] - 当一张图片加载完成时的处理函数
 * @returns {Promise} 加载完成（resolve表示全部成功；reject表示有部分失败）
 */
export default async function loadImgs({
  srcs = [],
  timeout = 10000,
  slience = true,
  retryable = false,
  onOneLoad,
} = {}) {
  let loaded = 0
  const { length: total } = srcs
  let erred = false //是否已出错
  return Promise.all(
    srcs.map((src) => {
      return loadImg({
        src,
        timeout,
        slience,
        retryable,
      })
        .then(() => {
          if (!erred) {
            if (onOneLoad) {
              onOneLoad({
                src,
                loaded: ++loaded,
                total,
              })
            }
          }
        })
        .catch((e) => {
          erred = true
          return Promise.reject(e)
        })
    })
  )
}
