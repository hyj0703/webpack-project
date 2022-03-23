import replaceFakeData from './replaceFakeData'
import { getQuery } from '@jmdd/jmdd-url'
import functionIdMapToMockedInfo from './functionIdMapToMockedInfo.json'

const RawXMLHttpRequest = XMLHttpRequest
window.XMLHttpRequest = class {
  constructor() {
    const xhr = new RawXMLHttpRequest()
    const mockedXhr = new MockedXMLHttpRequest(xhr)
    for (let prop in xhr) {
      Object.defineProperty(mockedXhr, prop, {
        enumerable: true,
        get() {
          switch (prop) {
            case 'readyState': {
              return mockedXhr._isMocked ? 4 : xhr[prop]
            }
            case 'status': {
              return mockedXhr._isMocked ? 200 : xhr[prop]
            }
            case 'responseText': {
              return mockedXhr._isMocked
                ? JSON.stringify(replaceFakeData(mockedXhr._mockedData))
                : xhr[prop]
            }
            case 'open': {
              return function (...args) {
                const [, url] = args
                mockedXhr._url = url
                xhr.open(...args)
              }
            }
            case 'send': {
              return function (...args) {
                const [data] = args
                mockedXhr._data = data
                mockedXhr._chkIsMocked()
                if (mockedXhr._isMocked) {
                  setTimeout(() => {
                    if (xhr.onreadystatechange) {
                      xhr.onreadystatechange()
                    }
                    const readyStateChangeEvent = document.createEvent('Event')
                    readyStateChangeEvent.initEvent(
                      'readystatechange',
                      false,
                      false
                    )
                    xhr.dispatchEvent(readyStateChangeEvent)

                    if (xhr.onload) {
                      xhr.onload()
                    }
                    const loadEvent = document.createEvent('Event')
                    loadEvent.initEvent('load', false, false)
                    xhr.dispatchEvent(loadEvent)
                  })
                } else {
                  xhr.send(...args)
                }
              }
            }
            default: {
              const val = xhr[prop]
              return typeof val === 'function' ? val.bind(xhr) : val
            }
          }
        },
        set(newVal) {
          xhr[prop] = newVal
        },
      })
    }
    return mockedXhr
  }
}

class MockedXMLHttpRequest {
  constructor(xhr) {
    this._xhr = xhr //实际的xhr对象

    this._url = undefined //open的url
    this._data = undefined //send的data
    this._mockedData = undefined //mock的数据
    this._isMocked = false //是否需要mock
  }

  _getQueryFunctionId() {
    return getQuery(this._url, 'functionId')
  }

  _getUnserializeFunctionId() {
    const { _data } = this
    let ret = undefined
    if (typeof FormData !== 'undefined' && _data instanceof FormData) {
      if (typeof _data.get === 'function') {
        ret = _data.get('functionId')
      }
    } else if (typeof _data === 'string') {
      _data.split('&').some((kvp) => {
        const [key, val] = kvp.split('=')
        if (key === 'functionId') {
          ret = val
          return true
        }
      })
    }
    return ret
  }

  _getFunctionId() {
    return this._getQueryFunctionId() || this._getUnserializeFunctionId()
  }

  /**
   * 检测是否需要mock，若需要则设置_isMocked为true，_mockedData为mock的数据
   */
  _chkIsMocked() {
    const mockedInfo = functionIdMapToMockedInfo[this._getFunctionId()]
    if (mockedInfo) {
      mockedInfo.count++
      const { mockedDatas, count } = mockedInfo
      this._isMocked = mockedDatas.some(
        ({
          pattern: {
            type: { name },
            val,
            a,
            b,
            sign,
          },
          data,
        }) => {
          switch (name) {
            case 'exact': {
              if (val === count) {
                this._mockedData = data
                return true
              }
              break
            }
            case 'n': {
              if ((count - b) % a === 0) {
                this._mockedData = data
                return true
              }
              break
            }
            case 'inequality': {
              switch (sign.name) {
                case 'gte': {
                  if (count >= val) {
                    this._mockedData = data
                    return true
                  }
                  break
                }
                case 'gt': {
                  if (count > val) {
                    this._mockedData = data
                    return true
                  }
                  break
                }
              }
              break
            }
            case 'def': {
              this._mockedData = data
              return true
            }
          }
        }
      )
    }
  }
}
