import React, { useState } from 'react'
import Flipper from '../Flipper/Flipper'
import './DemoFlipper.scss'

export default function DemoFlipper() {
  const [type, setType] = useState('string')
  return (
    <>
      <button onClick={() => setType(type === 'string' ? 'number' : 'string')}>
        更改children
      </button>
      <Flipper className="demo-flipper">
        {type === 'string'
          ? [
              'DemoMock',
              'DemoAdvertGroup',
              'DemoErrorBoundary',
              'DemoPopup',
              'DemoBarrages',
              'DemoFlipper',
              'DemoToast',
              'DemoPageLoading',
              'DemoPing',
              'DemoRouter',
              'DemoImg',
              'DemoDate',
              'DemoMask',
              'DemoLoadImgs',
              'DemoComposeImgs',
            ]
          : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
      </Flipper>
    </>
  )
}
