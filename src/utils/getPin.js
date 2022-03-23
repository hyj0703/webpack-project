import cookie from '@jmfe/jm-cookie'

/**
 * 获取用户pin
 * @returns {String} 用户pin
 */
export default function getPin() {
  return decodeURIComponent(cookie.get('pwdt_id') || '')
}
