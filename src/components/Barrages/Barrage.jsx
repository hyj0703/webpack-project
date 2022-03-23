import React, { useContext, useEffect, useRef } from 'react'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './Barrage.scss'
import BarragesContext from './BarragesContext'

export default withErrorBoundary()(function Barrage({
  className = '',
  ...props
}) {
  const { registBarrageRef, unregistBarrageRef } = useContext(BarragesContext)
  const ref = useRef()
  useEffect(() => {
    const { current } = ref
    registBarrageRef(current)
    return () => unregistBarrageRef(current)
  }, [])
  return <div className={`barrage ${className}`} ref={ref} {...props} />
})
