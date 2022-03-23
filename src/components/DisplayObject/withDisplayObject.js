import React from 'react'
import DisplayObject from './DisplayObject'

export default (opts) => (WrappedComponent) => {
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  const displayName = `DisplayObject(${wrappedComponentName})`
  const DisplayObjectWrapperComponent = function DisplayObjectWrapperComponent(
    props
  ) {
    return (
      <DisplayObject {...opts}>
        {(propsFromDisplayObject) => (
          <WrappedComponent {...propsFromDisplayObject} {...props} />
        )}
      </DisplayObject>
    )
  }
  DisplayObjectWrapperComponent.displayName = displayName
  return DisplayObjectWrapperComponent
}
