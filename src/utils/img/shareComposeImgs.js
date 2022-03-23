import 'formdata-polyfill'

/**
 * 要合成图片的信息
 * @typedef {Object} imgInfo
 * @property {String} src - 要合成图片的地址
 * @property {Number} x - 要合成图片中心的x（单位：像素）
 * @property {Number} y - 要合成图片中心的y（单位：像素）
 * @property {Number} [scaleX = 1] - 要合成图片的x缩放比例（以中心为原点缩放）
 * @property {Number} [scaleY = 1] - 要合成图片的y缩放比例（以中心为原点缩放）
 * @property {Number} [angle = 0] - 要合成图片的旋转角度（以中心为原点旋转）（顺时针为正，逆时针为负）（单位：度）
 */

/**
 * 合成图片
 * @param {Object} opts - 参数
 *      @param {Number} opts.height - 最终合成图片的高度（单位：像素）
 *      @param {Number} opts.width - 最终合成图片的宽度（单位：像素）
 *      @param {Number} [opts.radius = 0] - 最终合成图片的圆角（单位：像素）
 *      @param {imgInfo[]} [opts.imgInfos = []] - 要合成图片的信息组成的数组（数组元素越靠前，绘制顺序越底层）
 *      @param {Number} [opts.timeout = 10000] - 超时时间（单位：毫秒）
 * @returns {Promise<String>} 合成后的图片地址
 */
export default async function composeImgs({
  height,
  width,
  radius = 0,
  imgInfos = [],
  timeout = 10000,
  addressText,
  dateText,
}) {
  const cvs = document.createElement('canvas')
  cvs.height = height
  cvs.width = width
  const ctx = cvs.getContext('2d')
  if (radius > 0) {
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.arcTo(width, 0, width, height, radius)
    ctx.arcTo(width, height, 0, height, radius)
    ctx.arcTo(0, height, 0, 0, radius)
    ctx.arcTo(0, 0, width, 0, radius)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.clip()
  }
  ;(
    await Promise.all(
      imgInfos.map(
        (imgInfo) =>
          new Promise((resolve, reject) => {
            const { src } = imgInfo
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.addEventListener('load', () =>
              resolve({
                ...imgInfo,
                img,
              })
            )
            img.addEventListener('error', () => reject('下载图片失败'))
            img.src = src
          })
      )
    )
  ).forEach(({ img, scaleX = 1, scaleY = 1, angle = 0, x = 0, y = 0 }) => {
    ctx.save()
    const { naturalWidth, naturalHeight } = img
    ctx.translate(x, y)
    ctx.rotate((angle * Math.PI) / 180)
    ctx.scale(scaleX, scaleY)
    ctx.translate(-naturalWidth / 2, -naturalHeight / 2)
    ctx.drawImage(img, 0, 0)
    ctx.restore()
  })

  // 设置字体
  ctx.font = '24px SimHei'
  ctx.fillStyle = '#79490b'
  ctx.fillText(addressText, 140, 315)
  ctx.fillText(dateText, 430, 315)

  ctx.font = '32px Arial'
  ctx.fillStyle = '#FFEFAA'
  ctx.fillText('全民炸年兽', 200, 720)
  ctx.fillText('瓜分10亿年终奖', 170, 760)

  const blob = await new Promise((resolve, reject) => {
    try {
      cvs.toBlob(resolve, ...(radius > 0 ? ['image/png'] : ['image/png', 1]))
    } catch (e) {
      console.error(e)
      reject('获取合成图片信息失败')
    }
  })

  return await new Promise((resolve, reject) => {
    let t //超时的计时器
    const xhr = new XMLHttpRequest()
    xhr.open('post', 'https://pic.jd.com/0/bd4e97ca9b214ab7946819a852e379a5')
    xhr.onload = () => {
      clearTimeout(t)
      try {
        const response = JSON.parse(xhr.responseText)
        const { id, msg } = response || {}
        if (id === '1') {
          resolve(`//m.360buyimg.com/mobileActivity/${msg}`)
        } else {
          reject(
            {
              101: 'appkey不存在',
              103: '图片文件异常，上传失败',
              104: '不允许该请求源站访问：允许*.jd.com、*.jd.hk格式的域名跨域访问',
              1: 'JFS授权码错误或无此授权码，请重新申请或找回授权码',
              2: '未给业务设置目录生成方式，请联系JFS管理员',
              3: '上传图片格式(扩展名)错误，支持：jpeg、png、gif、webp、bmp',
              4: '图片大小不能超过5M',
              5: '上传路径为空或图片不存在，请重新上传',
              6: '水印位置为空',
              7: '业务名或验证码错误',
              8: '获取异常，请重试',
              9: '删除异常，请重试',
              10: '上传失败，请重试',
              11: '图片本身出现问题，请检查图片格式',
              66: 'uuid长度超过200',
            }[msg] || msg
          )
        }
      } catch (e) {
        console.error(e)
        reject('解析合成图片地址数据失败')
      }
    }
    xhr.addEventListener('error', () => reject('获取合成图片地址失败'))
    t = setTimeout(() => reject('上传图片超时'), timeout)
    const formData = new FormData()
    formData.append('file', blob)
    xhr.send(formData)
  })
}

export const composeImgsEnabled = (() => {
  const cvs = document.createElement('canvas')
  if (!('toBlob' in cvs)) {
    return false
  }
  if (typeof FormData === 'undefined') {
    return false
  }
  return true
})() //composeImgs是否可用
