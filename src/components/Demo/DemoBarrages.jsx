import React from 'react'
import Barrage from '../Barrages/Barrage'
import Barrages from '../Barrages/Barrages'
import './DemoBarrages.scss'

export default function DemoBarrages() {
  return (
    <div className="demo-barrages">
      <Barrages minHSpacing={20}>
        <Barrage>DemoMock</Barrage>
        <Barrage>DemoAdvertGroup</Barrage>
        <Barrage>DemoErrorBoundary</Barrage>
        <Barrage>DemoPopup</Barrage>
        <Barrage>DemoBarrages</Barrage>
        <Barrage>DemoFlipper</Barrage>
        <Barrage>DemoToast</Barrage>
        <Barrage>DemoPageLoading</Barrage>
        <Barrage>DemoPing</Barrage>
        <Barrage>DemoRouter</Barrage>
        <Barrage>DemoImg</Barrage>
        <Barrage>DemoDate</Barrage>
        <Barrage>DemoMask</Barrage>
        <Barrage>DemoLoadImgs</Barrage>
        <Barrage>DemoComposeImgs</Barrage>
      </Barrages>
    </div>
  )
}
