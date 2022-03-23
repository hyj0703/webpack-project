import React from 'react'
import Popup from './Popup'

export default (opts) => (WrappedComponent) => {
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  const displayName = `Popup(${wrappedComponentName})`
  const PopupWrapperComponent = function PopupWrapperComponent({ ...props }) {
    return (
      <Popup {...opts}>
        {({ props: propsFromPopup, hidePopup }) => (
          <WrappedComponent
            {...propsFromPopup}
            {...props}
            hidePopup={hidePopup}
          />
        )}
      </Popup>
    )
  }
  PopupWrapperComponent.displayName = displayName
  return PopupWrapperComponent
}
