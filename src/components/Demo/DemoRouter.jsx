import { history } from '@jmdd/jmdd-react-router'
import React from 'react'
import './DemoRouter.scss'

export default function DemoRouter() {
  return (
    <button
      onClick={() =>
        history.push({
          to: '/home',
          onBack() {
            alert('从跳转的路由返回了')
          },
        })
      }>
      跳转路由
    </button>
  )
}
