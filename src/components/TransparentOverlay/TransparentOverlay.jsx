import PreventDefault from '@jmdd/jmdd-react-prevent-default'
import React from 'react'
import withDisplayObject from '../DisplayObject/withDisplayObject'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './TransparentOverlay.scss'

export default withErrorBoundary()(
  withDisplayObject({ type: 'transparentOverlay' })(
    function HomeTransparentOverlay() {
      return <PreventDefault className="transparent-overlay" />
    }
  )
)
