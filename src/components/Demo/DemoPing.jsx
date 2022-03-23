import ping from '@jmdd/jmdd-ping'
import React from 'react'
import './DemoPing.scss'

export default function DemoPing() {
  return (
    <button onClick={() => ping('eventId', { eventParam: 'eventParam' })}>
      发送埋点
    </button>
  )
}
