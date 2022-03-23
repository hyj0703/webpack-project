import React, { useState } from 'react'
import AutoFontSize from '../AutoFontSize/AutoFontSize'
import './DemoAutoFontSize.scss'

export default function DemeAutoFontSize() {
  const [txt, setTxt] = useState('123')
  return (
    <>
      <AutoFontSize
        className="demo-auto-font-size"
        xAlign="c" //可选值：l、c、r
        yAlign="m" //可选值：t、m、b
      >
        <span className="demo-auto-font-size__unit">¥</span>
        {txt}
      </AutoFontSize>
      <input
        onInput={({ target: { value } }) => setTxt(value)}
        defaultValue={txt}
      />
    </>
  )
}
