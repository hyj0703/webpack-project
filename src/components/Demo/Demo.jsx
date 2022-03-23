import { withRoute } from '@jmdd/jmdd-react-router'
import React from 'react'
import { connect } from 'react-redux'
import { DEMO_GET_DATA } from '../../actions/demo'
import { withPromise } from '../../store'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './Demo.scss'
import DemoAnimationNum from './DemoAnimationNum'
import DemoAutoFontSize from './DemoAutoFontSize'
import DemoBarrages from './DemoBarrages'
import DemoCall from './DemoCall'
import DemoComposeImgs from './DemoComposeImgs'
import DemoDate from './DemoDate'
import DemoEnvs from './DemoEnvs'
import DemoErrorBoundary from './DemoErrorBoundary'
import DemoFlipper from './DemoFlipper'
import DemoImg from './DemoImg'
import DemoLoadImgs from './DemoLoadImgs'
import DemoMask from './DemoMask'
import DemoPageLoading from './DemoPageLoading'
import DemoPopup from './DemoPopup'
import DemoPopupItems from './DemoPopupItems'
import DemoPullDowner from './DemoPullDowner'
import DemoRouter from './DemoRouter'
import DemoTo from './DemoTo'
import DemoToast from './DemoToast'

export default connect(
  ({ demo }) => {
    return { demo }
  },
  withPromise((dispatch) => {
    return {
      getDemoData() {
        return dispatch({
          type: DEMO_GET_DATA.type,
        })
      },
    }
  })
)(
  withErrorBoundary()(
    withRoute({
      path: '/demo', //路由的路径
      async onEnter() {
        const {
          props: { getDemoData },
        } = this
        return await getDemoData()
      }, //当进入该路由前的处理函数
    })(function Demo() {
      return (
        <DemoPullDowner>
          {() => {
            return Object.entries({
              DemoErrorBoundary,
              DemoPopup,
              DemoBarrages,
              DemoFlipper,
              DemoToast,
              DemoPageLoading,
              DemoRouter,
              DemoImg,
              DemoDate,
              DemoMask,
              DemoLoadImgs,
              DemoComposeImgs,
              DemoAnimationNum,
              DemoEnvs,
              DemoTo,
              DemoCall,
              DemoAutoFontSize,
              DemoPopupItems,
            }).map(([name, DemoComponent]) => {
              return (
                <div className="demo__item" key={name}>
                  <p className="demo__item-title">{name}:</p>
                  <DemoComponent />
                </div>
              )
            })
          }}
        </DemoPullDowner>
      )
    })
  )
)
