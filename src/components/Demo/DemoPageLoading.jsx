import { hidePageLoading, showPageLoading } from '@jmdd/jmdd-page-loading'
import React from 'react'
import './DemoPageLoading.scss'

export default function DemoPageLoading() {
  return (
    <>
      <button
        onClick={async () => {
          showPageLoading()
          await new Promise((resolve) => setTimeout(resolve, 3000))
          hidePageLoading()
        }}>
        显示3秒后隐藏
      </button>
    </>
  )
}
