export default ({ width, height, num = 5 }) => {
  let level = 0
  //位置坐标对象
  let numArr = null
  if (num <= 5) {
    level = 6
    switch (num) {
      case 1:
        numArr = {
          0: [0, 0],
        }
        break
      case 2:
        numArr = {
          0: [-1, 0],
          1: [1, 0],
        }
        break
      case 3:
        numArr = {
          0: [0, 0],
          1: [2, 0],
          2: [-2, 0],
        }
        break
      case 4:
        numArr = {
          0: [1, 1],
          1: [-1, 1],
          2: [1, -1],
          3: [-1, -1],
        }
        break
      case 5:
        numArr = {
          0: [0, 1],
          1: [2, 1],
          2: [1, -1],
          3: [-1, -1],
          4: [-2, 1],
        }
        break
    }
  } else if (num <= 15) {
    level = 14
    numArr = {
      0: [0, 1],
      1: [2, 1],
      2: [1, -4],
      3: [-1, -4],
      4: [-2, 1],
      5: [-1, 6],
      6: [1, 6],
      7: [3, 6],
      8: [4, 1],
      9: [3, -4],
      10: [-3, -4],
      11: [-4, 1],
      12: [-3, 6],
      13: [-5, 6],
      14: [5, 6],
    }
  } else {
    level = 12
    numArr = {
      0: [0, 0],
      1: [2, 0],
      2: [1, -2],
      3: [-1, -2],
      4: [-2, 0],
      5: [-1, 2],
      6: [1, 2],
      7: [3, 2],
      8: [4, 0],
      9: [3, -2],
      10: [2, -4],
      11: [0, -4],
      12: [-2, -4],
      13: [-3, -2],
      14: [-4, 0],
      15: [-3, 2],
      16: [-1, 4],
      17: [1, 4],
      18: [3, 4],
      19: [5, 2],
      20: [5, -2],
      21: [4, -4],
      22: [3, -6],
      23: [1, -6],
      24: [-1, -6],
      25: [-3, -6],
      26: [-4, -4],
      27: [-5, -2],
      28: [-5, 2],
      29: [-3, 4],
    }
  }
  //正方形的小格子的宽高
  const w = Math.floor(width / level)
  const h = Math.floor((w * height) / width)
  //行数
  const hn = Math.floor(height / h)
  //所有坐标对象
  const queue = {}
  //输出数组
  const queueArr = []
  for (let i = 0; i < level; i++) {
    for (let j = 0; j < hn; j++) {
      queue[i + '' + j] = [w * i, h * j]
    }
  }
  const centerPosition = [Math.floor(level / 2), Math.floor(hn / 2)]
  for (let i = 0; i < num; i++) {
    const xy =
      centerPosition[0] + numArr[i][0] + '' + (centerPosition[1] + numArr[i][1])
    queueArr.push(queue[xy])
  }
  return queueArr
}
