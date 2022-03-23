import PreventDefault from '@jmdd/jmdd-react-prevent-default'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import loadImgs from '../../utils/img/loadImgs'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'
import './BranchLineTransfer.scss'

const BranchLineTransfer = function BranchLineTransfer({
  show,
  changePageBanner,
}) {
  const [loaded, setLoaded] = useState(false) //是否已加载
  useEffect(async () => {
    if (show) {
      // 异常页曝光(异常类型：异常类型：0-活动未开始页，1-活动已结束页，2-网络异常页，3-登录页，4-一手机多账号页，5-风控页，6-站外宣传页，7-loading页，8-支线活动未开始，9-支线活动已结束，10-支线转场页)
    }
  }, [show])
  useEffect(async () => {
    if (changePageBanner) {
      await loadImgs({ srcs: [changePageBanner] })
      setLoaded(true)
    }
  }, [changePageBanner])

  return (
    <PreventDefault>
      <CSSTransition
        timeout={1000}
        in={Boolean(show && loaded)} //确保图片加载后再显示
        unmountOnExit
        classNames="branch-line-">
        <div className="branch-line-transfer">
          {changePageBanner ? (
            <div
              className="branch-line-transfer__banner-img"
              style={{ backgroundImage: `url(${changePageBanner})` }}></div>
          ) : null}
        </div>
      </CSSTransition>
    </PreventDefault>
  )
}

export default connect(
  ({ branchLineTransfer: { show }, pk: { changePageBanner } }) => {
    return { show, changePageBanner }
  }
)(withErrorBoundary()(BranchLineTransfer))
