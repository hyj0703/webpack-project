import React, { useRef, useState } from 'react'
import Mask from '../Mask/Mask'
import './DemoMask.scss'

export default function DemoMask() {
  const ref = useRef()
  const [shown, setShown] = useState(false)
  return (
    <>
      <button onClick={() => setShown(!shown)} ref={ref}>
        {shown ? '隐藏遮罩' : '显示遮罩'}
      </button>
      <Mask shown={shown} target={{ ref, padding: 5, radius: 5 }} />
    </>
  )
}
