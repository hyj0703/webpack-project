import FAKE_AVATARS from './FAKE_AVATARS'
import FAKE_NICKNAMES from './FAKE_NICKNAMES'

const TYPE_MAP_TO_FAKE_DATAS_TPL = {
  FAKE_AVATAR: FAKE_AVATARS,
  FAKE_NICKNAME: FAKE_NICKNAMES,
}
const typeMapToFakeDatas = {}

/**
 * 获取假数据
 * @param {String} type - 假数据的类型（可能的值：FAKE_AVATAR-头像）
 * @returns {*} 获取到的假数据（若未获取到假数据，则返回undefined）
 */
function getFakeData(type) {
  if (type in TYPE_MAP_TO_FAKE_DATAS_TPL) {
    let { [type]: fakeDatas } = typeMapToFakeDatas
    if (!fakeDatas || !fakeDatas.length) {
      typeMapToFakeDatas[type] = fakeDatas = TYPE_MAP_TO_FAKE_DATAS_TPL[type]
        .slice()
        .sort(() => Math.random() - 0.5)
    }
    return fakeDatas.pop()
  }
}

/**
 * 替换假数据
 * @param {Object} data - 要替换的数据
 * @returns {Object} 替换后的数据
 */
export default function replaceFakeData(data) {
  if (typeof data === 'object' && data) {
    Object.entries(data).forEach(([key, val]) => {
      if (typeof val === 'object') {
        data[key] = replaceFakeData(val)
      } else if (val in TYPE_MAP_TO_FAKE_DATAS_TPL) {
        data[key] = getFakeData(val)
      }
    })
  }
  return data
}
