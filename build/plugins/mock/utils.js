const fs = require('fs')
const path = require('path')

const MOCK_PATH = path.resolve(__dirname, '../../../mock') //mock文件夹地址
const FUNCTION_ID_MAP_TO_MOCKED_INFO_JSON_PATH = path.resolve(
  __dirname,
  './functionIdMapToMockedInfo.json'
) //functionIdMapToMockedInfo.json地址
const PATTERN_TYPE = {
  exact: {
    name: 'exact',
    priority: 0,
  },
  n: {
    name: 'n',
    priority: 1,
  },
  inequality: {
    name: 'inequality',
    priority: 2,
  },
  def: {
    name: 'def',
    priority: Infinity,
  },
} //pattern类型
const PATTERN_INEQUALITY_SIGN = {
  gte: {
    name: 'gte',
    priority: 0,
  },
  gt: {
    name: 'gt',
    priority: 1,
  },
} //pattern不等号

/**
 * 生成functionIdMapToMockedInfo
 */
function genFunctionIdMapToMockedInfo() {
  const ret = {}
  fs.readdirSync(MOCK_PATH).forEach((file) => {
    const { ext, name } = path.parse(file)
    if (ext === '.json') {
      const filePath = path.resolve(MOCK_PATH, `./${file}`)
      const stat = fs.statSync(filePath)
      if (stat.isFile()) {
        const [functionId, rawPattern = ''] = name.split('.')
        if (!ret[functionId]) {
          ret[functionId] = {
            mockedDatas: [],
            count: 0,
          }
        }
        const match = rawPattern.match(
          /^(?:(\d+)|((\d+)?n(?:\+(\d+))?)|(?:(gte?)(\d+))|())$/
        )
        const pattern = {}
        if (match) {
          const [
            ,
            exactVal,
            n,
            na = 1,
            nb,
            inequalitySign,
            inequalityVal,
            def,
          ] = match
          if (exactVal) {
            pattern.type = PATTERN_TYPE.exact
            pattern.val = parseInt(exactVal)
          } else if (n) {
            pattern.type = PATTERN_TYPE.n
            pattern.a = parseInt(na)
            pattern.b = parseInt(nb)
          } else if (inequalitySign) {
            pattern.type = PATTERN_TYPE.inequality
            pattern.sign = PATTERN_INEQUALITY_SIGN[inequalitySign]
            pattern.val = parseInt(inequalityVal)
          } else if (def === '') {
            pattern.type = PATTERN_TYPE.def
          } else {
            throw `${file} 文件名格式不正确，mock文件更新失败\n正确的文件名格式有以下几种：\n  functionId.数字.json\n  functionId.an+b.json\n  functionId.gte数字.json\n  functionId.gt数字.json`
          }
        } else {
          throw `${file} 文件名格式不正确，mock文件更新失败\n正确的文件名格式有以下几种：\n  functionId.数字.json\n  functionId.an+b.json\n  functionId.gte数字.json\n  functionId.gt数字.json`
        }
        try {
          ret[functionId].mockedDatas.push({
            pattern,
            data: JSON.parse(fs.readFileSync(filePath, 'utf8')),
          })
        } catch (e) {
          throw `${file} 内容需为标准的json格式，mock文件更新失败`
        }
      }
    }
  })
  for (let functionId in ret) {
    ret[functionId].mockedDatas.sort(
      (
        { pattern: { type: typeA, val: valA, a: aA, b: bA, sign: signA } },
        { pattern: { type: typeB, val: valB, a: aB, b: bB, sign: signB } }
      ) => {
        const { priority: typePriorityA } = typeA
        const { priority: typePriorityB } = typeB
        const typePriorityDiff = typePriorityA - typePriorityB
        if (typePriorityDiff) {
          return typePriorityDiff
        } else {
          switch (typeA) {
            case PATTERN_TYPE.exact: {
              return valB - valA
            }
            case PATTERN_TYPE.n: {
              const aDiff = aB - aA
              if (aDiff) {
                return aDiff
              } else {
                return bB - bA
              }
            }
            case PATTERN_TYPE.inequality: {
              const valDiff = valB - valA
              if (valDiff) {
                return valDiff
              } else {
                const { priority: signPriorityA } = signA
                const { priority: signPriorityB } = signB
                return signPriorityA - signPriorityB
              }
            }
          }
        }
      }
    )
  }
  return ret
}

/**
 * 生成functionIdMapToMockedInfo.json
 */
function genFunctionIdMapToMockedInfoJson() {
  try {
    fs.writeFileSync(
      FUNCTION_ID_MAP_TO_MOCKED_INFO_JSON_PATH,
      JSON.stringify(genFunctionIdMapToMockedInfo())
    )
  } catch (e) {
    console.log(`\u001B[91m${e}\u001B[0m`)
  }
}

let tDebounceGenFunctionIdMapToMockedInfoJson = null //debounceGenFunctionIdMapToMockedInfoJson的计时器

/**
 * 防抖的genFunctionIdMapToMockedInfoJson
 */
function debounceGenFunctionIdMapToMockedInfoJson() {
  clearTimeout(tDebounceGenFunctionIdMapToMockedInfoJson)
  tDebounceGenFunctionIdMapToMockedInfoJson = setTimeout(
    genFunctionIdMapToMockedInfoJson,
    500
  )
}

/**
 * 监听mock文件夹变化并更新functionIdMapToMockedInfo.json
 */
function watchMockChange() {
  fs.watch(MOCK_PATH, (eventType, filename) => {
    try {
      const stat = fs.statSync(path.resolve(MOCK_PATH, `./${filename}`))
      if (stat.isFile()) {
        debounceGenFunctionIdMapToMockedInfoJson()
      }
    } catch ({ code }) {
      if (code === 'ENOENT') {
        //当文件从mock文件夹中删除时，使用statSync会抛出ENOENT，此时仍需要更新functionIdMapToMockedInfo.json
        debounceGenFunctionIdMapToMockedInfoJson()
      }
    }
  })
}

module.exports = {
  genFunctionIdMapToMockedInfoJson,
  watchMockChange,
}
