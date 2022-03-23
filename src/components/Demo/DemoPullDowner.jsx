import { history } from '@jmdd/jmdd-react-router'
import React, { useRef } from 'react'
import PullDowner from '../PullDowner/PullDowner'
import './DemoPullDowner.scss'

export default function DemoPullDowner(props) {
  const tRef = useRef()
  const {
    documentElement: { clientHeight: contentHeight },
  } = document

  /**
   * 跳转
   * @param {Function} fold - 折叠收起的函数
   */
  function to(fold) {
    const { current: t } = tRef
    clearTimeout(t)
    history.push({
      to: '/home',
      onBack() {
        fold(false) //在跳转返回后再收起下拉
      },
    })
  }
  return (
    <PullDowner
      content={({ fold }) => (
        <div
          className="demo-pull-downer__content"
          onClick={() => to(fold)}
          style={{
            height: contentHeight,
          }}>
          点击整个页面都能跳转
        </div>
      )}
      onExpand={({ fold }) => {
        tRef.current = setTimeout(() => to(fold), 1250)
      }}
      onFold={() => {
        const { current: t } = tRef
        clearTimeout(t)
      }}
      refreshId={contentHeight}
      {...props}
    />
  )
}
