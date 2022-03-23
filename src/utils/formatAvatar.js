/**
 * 格式化头像
 * @param {String} avatar - 要格式化的头像
 * @param {Boolean} [requireBorder = true] - 是否需要边框
 * @returns {String} 格式化后的头像
 */
export default function formatAvatar(avatar, requireBorder = true) {
  return requireBorder
    ? '//m.360buyimg.com/mobileActivity/jfs/t1/112512/16/21429/14979/61de4808Eff8b048c/ab8cd45eeb2001ca.png'
    : '//m.360buyimg.com/mobileActivity/jfs/t1/123377/12/20853/5941/61dff844E0ecb22b1/65c1763b7701b837.png'
}
