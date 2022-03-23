/**
 * 是否是金融环境
 * @returns {Boolean} 是否是金融环境
 */
export default function isJr() {
  const { userAgent } = navigator
  return /jdjr-app/i.test(userAgent)
}
