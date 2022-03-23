import { format } from '@jmdd/jmdd-date'
import React from 'react'
import './DemoDate.scss'

export default function DemoDate() {
  return (
    <>
      <button
        onClick={() => alert(format(new Date(), 'y年MM月dd日 HH:mm:ss:SSS'))}>
        格式化当前时间
      </button>
    </>
  )
}
