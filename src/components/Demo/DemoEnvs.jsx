import { isJd } from '@jmdd/jmdd-envs'
import { getJdVersion } from '@jmdd/jmdd-versions'
import React from 'react'
import isJr from '../../utils/isJr'
import isSc from '../../utils/isSc'
import useJrConf from '../../utils/useJrConf'
import './DemoEnvs.scss'

export default function DemoEnvs() {
  return (
    <>
      <button onClick={() => alert(isSc())}>是否是商城</button>
      <button onClick={() => alert(isJr())}>是否是金融</button>
      <button onClick={() => alert(useJrConf())}>是否使用金融配置</button>
      <button onClick={() => alert(isJd())}>是否是京东（是商城或金融）</button>
      <button onClick={() => alert(getJdVersion())}>获取环境版本</button>
    </>
  )
}
