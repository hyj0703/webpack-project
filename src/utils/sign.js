/**
 * 判断签到的第几天
 * @returns {date} 签到的日期
 */
export function getDay(endDate) {
  let startDate = '2021-10-08'
  if (endDate) {
    let day1 = Date.parse(startDate)
    let day2 = Date.parse(endDate)
    return Math.round((day2 - day1) / (1000 * 60 * 60 * 24) + 1)
  } else {
    return 0
  }
}

/**
 * 判断是否到期
 * @returns {date} 限定日期
 */
export function limitDay() {
  let today = new Date()
  let limitDay = Date.parse('2021-11-11')
  return (limitDay - today) / (1000 * 60 * 60 * 24) > 0 ? true : false
}

/**
 * 格式化用户名
 * n≤2位，展示首部1位，后面用*代替，1位字符时后面增加*展示；
 * 2＜n≤6位，展示首部1位，后面用*代替；
 * n＞6位，展示首部1位，后面用*号代替（最多展示5个*），如：jxkad展示为j*****，海绵宝宝派大星展示为海*****。
 * @returns {name} 用户名
 */

export function formatName(name) {
  if (!name) return ''
  let n = name.length,
    nickname = ''
  if (n <= 2) {
    nickname = name.substr(0, 1) + '*'
  }
  if (2 < n && n <= 6) {
    nickname = name.substr(0, 1) + name.substr(1).replace(/./g, '*')
  }
  if (6 < n) {
    nickname = name.substr(0, 1) + '*****'
  }
  return nickname
}

/**
 * 数组按照日期排序
 * @returns {arr} 数组
 */
export function sortDate(arr) {
  if (!arr || arr.length < 1) return []
  var arrLength = arr.length
  for (var i = 0; i < arrLength - 1; i++) {
    for (var j = 0; j < arrLength - 1 - i; j++) {
      let a = arr[j].ext
        ? arr[j].ext.replace('月', '-').replace('日', '')
        : '12-31 23:59'
      let b = arr[j + 1].ext
        ? arr[j + 1].ext.replace('月', '-').replace('日', '')
        : '12-31 23:59'
      if (Date.parse(a) < Date.parse(b)) {
        var temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }

  return arr
}

/**
 * 二维数组限制元素个数
 * @returns {arr} 数组
 */
export function limitArr(arr) {
  if (!arr || arr.length < 1) return []

  let tempArr = []
  let num = 0
  for (let i = 0; i < arr.length; i++) {
    let _temp = []
    for (let j = 0; j < arr[i].userJoinList.length; j++) {
      if (num < 100) {
        _temp.push(arr[i].userJoinList[j])
        num++
      }
    }
    if (_temp.length > 0) {
      arr[i].userJoinList = _temp
      tempArr.push(arr[i])
    }
  }
  return tempArr
}
