import toast from '@jmdd/jmdd-toast'
import React from 'react'
import './DemoToast.scss'

export default function DemoToast() {
  return (
    <>
      <button onClick={() => toast({ icon: 'suc', txt: '成功' })}>
        成功toast
      </button>
      <button onClick={() => toast({ icon: 'fail', txt: '失败' })}>
        失败toast
      </button>
      <button onClick={() => toast({ icon: 'info', txt: '信息' })}>
        信息toast
      </button>
      <button onClick={() => toast({ icon: 'warn', txt: '警告' })}>
        警告toast
      </button>
    </>
  )
}
