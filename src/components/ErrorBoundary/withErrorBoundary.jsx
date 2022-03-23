import React from 'react'
import ErrorBoundary from './ErrorBoundary'

export default (opts) => (WrappedComponent) => {
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  const displayName = `ErrorBoundary(${wrappedComponentName})`
  const ErrorBoundaryWrapperComponent = function ErrorBoundaryWrapperComponent(
    props
  ) {
    return (
      <ErrorBoundary {...opts}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
  ErrorBoundaryWrapperComponent.displayName = displayName
  return ErrorBoundaryWrapperComponent
}
