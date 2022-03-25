import React from 'react'
import { connect } from 'react-redux'
import { withRoute } from '@jmdd/jmdd-react-router'
import { RootState } from '../../store/store'
import { GET_PK_INIT_DATA } from '../../actions/pk'
import { withPromise } from '../../store'

export default connect(
  (store: RootState) => {
    const { pk } = store
    return { pk }
  },
  withPromise((dispatch) => {
    return {
      getPkHomeData(payload) {
        return dispatch({ type: GET_PK_INIT_DATA['type'], payload })
      },
    }
  })
)(
  withRoute({
    path: '/pk',
    async onEnter() {
      const { getPkHomeData } = this.props
      return await getPkHomeData({ name: 1 })
    },
  })(function PkMain({ pk }) {
    console.log('pk', pk, pk.name)
    return <div>div</div>
  })
)
