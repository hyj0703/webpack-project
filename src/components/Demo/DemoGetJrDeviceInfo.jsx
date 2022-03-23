import React from 'react'
import getJrDeviceInfo from '../../utils/getJrDeviceInfo'
import './DemoGetJrDeviceInfo.scss'

export default function DemoGetJrDeviceInfo() {
  return (
    <button onClick={async () => console.log(await getJrDeviceInfo())}>
      获取金融设备信息
    </button>
  )
}
