import { sendDirectShare } from '@jmdd/jmdd-full-share'
import React from 'react'
import { connect } from 'react-redux'
import { SHARE_PANEL_SHOW } from '../../actions/sharePanel'
import { withPromise } from '../../store'
import './DemoShare.scss'

export default connect(
  ({ demo }) => {
    return { demo }
  },
  withPromise((dispatch) => {
    return {
      showSharePanel(payload) {
        return dispatch({
          type: SHARE_PANEL_SHOW.type,
          payload,
        })
      },
    }
  })
)(function DemoShare({ showSharePanel }) {
  return (
    <>
      <button
        onClick={() =>
          showSharePanel({
            type: 'taskHelp',
            inviteId: 'fakceinviteid',
            keyEnabled: true,
          })
        }>
        打开分享面板
      </button>
      <button
        onClick={() =>
          sendDirectShare({
            longImg:
              '//m.360buyimg.com/mobileActivity/jfs/t1/170637/25/16939/457537/606e8787E85a5d0ca/36e3708966791e3c.jpg',
          })
        }>
        直接分享图片
      </button>
    </>
  )
})
