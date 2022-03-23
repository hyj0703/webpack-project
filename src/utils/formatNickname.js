/**
 * 格式化昵称
 * @param {String} nickname - 要格式化的昵称
 * @returns {String} 格式化后的昵称
 */
export default function formatNickname(nickname) {
  return (nickname || '').replace(/(?!^)./g, '*').slice(0, 6)
}
