import React, { useState } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './DemoErrorBoundary.scss'

export default withErrorBoundary({
  downgrade: 'jsx解析出错了，但是整个页面并没有挂掉',
})(function DemoErrorBoundary() {
  const [data, setData] = useState({})
  return (
    <button
      className={data.className}
      onClick={() => {
        setData(null)
      }}>
      触发jsx错误
    </button>
  )
})
