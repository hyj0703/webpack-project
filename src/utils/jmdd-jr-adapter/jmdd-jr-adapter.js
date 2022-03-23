import React, { useEffect, useState } from 'react'
import isJr from '../isJr'
import adaptAfterBack from './jmdd-jr-adapter-after-back'
import adaptEnvs from './jmdd-jr-adapter-envs'
import adaptFullShare from './jmdd-jr-adapter-full-share'
import adaptReactCustomSharePanel from './jmdd-jr-adapter-react-custom-share-panel'
import adaptTo from './jmdd-jr-adapter-to'
import adaptVersions from './jmdd-jr-adapter-versions'
import adaptVisibleByJd from './jmdd-jr-adapter-visible-by-jd'

let adapted = !isJr() //是否已适配

/**
 * 适配
 * @returns {Promise} 适配完成
 */
export default function adapt() {
  if (!adapted) {
    adapted = true
    adaptEnvs()
    adaptVersions()
    adaptVisibleByJd()
    adaptAfterBack()
    adaptTo()
    adaptFullShare()
    adaptReactCustomSharePanel()
  }
}

/**
 * 当适配出错时的处理函数
 * @callback module:jmddRnAdapter~onAdaptErr
 * @param {Error} err - 错误
 */

/**
 * 将Component转换为添加了适配逻辑的Component（Adapter）
 */
export function toAdapter() {
  return (ComponentToAdapt) =>
    function Adapter(props) {
      const [adapted, setAdapted] = useState(false)
      useEffect(() => {
        adapt()
        setAdapted(true)
      }, [])
      return adapted ? <ComponentToAdapt {...props} /> : null
    }
}
