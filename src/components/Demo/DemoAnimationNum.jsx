import React, { useState } from 'react'
import AnimationNum from '../AnimationNum/AnimationNum'
import './DemoAnimationNum.scss'

export default function DemoAnimationNum() {
  const [num, setNum] = useState(Math.round(Math.random() * 10000))
  return (
    <>
      <button onClick={() => setNum(Math.round(Math.random() * 10000))}>
        目标数字：{num}
      </button>
      <AnimationNum className="demo-animation-num">{num}</AnimationNum>
    </>
  )
}
