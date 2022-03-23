import Img from '@jmdd/jmdd-react-img'
import React, { useState } from 'react'
import './DemoImg.scss'

export default function DemoImg() {
  const [src, setSrc] = useState(null)
  return (
    <>
      <button
        onClick={() =>
          setSrc(
            '//img11.360buyimg.com/jdphoto/jfs/t27847/91/107794072/6854/14716732/5b850ecaN644d2983.png'
          )
        }>
        设置src
      </button>
      <Img className="demo-img" src={src} />
    </>
  )
}
