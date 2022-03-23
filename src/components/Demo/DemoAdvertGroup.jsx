import React from 'react'
import { connect } from 'react-redux'
import {
  ADVERT_GROUP_GET_BY_ITEMS,
  ADVERT_GROUP_GET_BY_MATCHES,
} from '../../actions/advertGroup'
import { withPromise } from '../../store'
import './DemoAdvertGroup.scss'

export default connect(
  null,
  withPromise((dispatch) => {
    return {
      getByMatches(payload) {
        return dispatch({
          type: ADVERT_GROUP_GET_BY_MATCHES.type,
          payload,
        })
      },
      getByItems(payload) {
        return dispatch({
          type: ADVERT_GROUP_GET_BY_ITEMS.type,
          payload,
        })
      },
    }
  })
)(function DemoAdvertGroup({ getByMatches, getByItems }) {
  return (
    <>
      <button
        onClick={async () => {
          console.log(
            await getByMatches({
              id: '05811747',
              mapTo: 'demoAdvertGropup',
              matches: [
                {
                  key: 'name',
                  val: '标题1',
                  items: {
                    title: { key: 'name', def: '默认标题' },
                  },
                },
                {
                  key: 'name',
                  val: '标题2',
                  items: {
                    img: {
                      key: 'pictureUrl',
                      def: '默认图片',
                      requireImgAdapt: true,
                    },
                  },
                },
                {
                  key: 'name',
                  val: '标题3',
                  items: {
                    comment: { key: 'comments.0', def: '默认备注' },
                  },
                },
              ],
            })
          )
        }}>
        getByMatches
      </button>
      <button
        onClick={async () =>
          console.log(
            await getByItems({
              id: '05811747',
              mapTo: 'demoAdvertGropup',
              random: true,
              items: {
                title: { key: 'name', def: '默认标题' },
                img: {
                  key: 'pictureUrl',
                  def: '默认图片',
                  requireImgAdapt: true,
                },
                comment: { key: 'comments.0', def: '默认备注' },
              },
            })
          )
        }>
        getByItems
      </button>
    </>
  )
})
