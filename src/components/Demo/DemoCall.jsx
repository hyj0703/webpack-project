import React from 'react'
import callJr from '../../utils/callJr'
import callSc from '../../utils/callSc'
import './DemoCall.scss'

export default function DemoCall() {
  return (
    <>
      <button onClick={() => callJr()}>唤起金融</button>
      <button onClick={() => callSc()}>唤起商城</button>
    </>
  )
}
