import { connect } from 'react-redux'
import {
  DISPLAY_OBJECT_END,
  DISPLAY_OBJECT_HIDE,
} from '../../actions/displayObject'
import { withPromise } from '../../store'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'

export default connect(
  ({ displayObject: { displayObjects } }, { type }) => {
    const { [type]: displayObject } = displayObjects
    let destroyed = true
    let displayed = false
    let props = null
    if (displayObject) {
      destroyed = false
      displayed = displayObject.displayed
      props = displayObject.props
    }
    return { ...props, destroyed, displayed, type }
  },
  withPromise((dispatch, { type }) => {
    return {
      hide(ret) {
        return dispatch({
          type: DISPLAY_OBJECT_HIDE.type,
          payload: { type, ret },
        })
      },
      end() {
        return dispatch({
          type: DISPLAY_OBJECT_END.type,
          payload: { type },
        })
      },
    }
  })
)(
  withErrorBoundary()(function DisplayObject(props) {
    const { destroyed, children } = props
    return destroyed ? null : children(props)
  })
)
