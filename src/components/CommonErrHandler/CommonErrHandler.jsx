import { hidePageLoading } from '@jmdd/jmdd-page-loading'
import { history } from '@jmdd/jmdd-react-router'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { RETRY_SET_CHECK_FUNCTION_ID } from '../../actions/retry'
import { withPromise } from '../../store'
import withErrorBoundary from '../ErrorBoundary/withErrorBoundary'

export default connect(
  null,
  withPromise((dispatch) => {
    return {
      setCheckFunctionId(payload) {
        return dispatch({
          type: RETRY_SET_CHECK_FUNCTION_ID.type,
          payload,
        })
      },
    }
  })
)(
  withErrorBoundary()(function CommonErrHandler({
    setCheckFunctionId,
    routerRef,
  }) {
    useEffect(() => {
      setCheckFunctionId({
        async checkFunctionId(data, { functionId }) {
          let redirectPath = null //是否重定向到的路由
          const { code, data: { bizCode, bizMsg } = {} } = data || {}
          switch (code) {
            case 0: {
              switch (bizCode) {
                case -1001: {
                  redirectPath = '/risk'
                  break
                }
                case -1003: {
                  redirectPath = `/logout?pin=${bizMsg}`
                  break
                }
                case -2001: {
                  redirectPath = functionId.match(/^tigernian_pk_/)
                    ? '/branchWait'
                    : '/wait'
                  break
                }
                case -2002: {
                  redirectPath = functionId.match(/^tigernian_pk_/)
                    ? '/branchEnd'
                    : '/end'
                  break
                }
              }
              break
            }
            case -10002: {
              redirectPath = functionId.match(/^tigernian_pk_/)
                ? '/branchWait'
                : '/wait'
              break
            }
            case -30001: {
              redirectPath = '/login'
              break
            }
          }
          /**
           * 这里用await new Promise(() => {})使得要跳转目标路由无限长时间加载，避免了“在重定向后又跳转到目标路由”的问题。
           * 但这也产生了其他问题：
           *    因为当目标路由是初始路由时，router的初始化过程是在初始路由加载结束后才结束的。
           *    同时在router初始化过程中整个路由是不渲染，
           *    这就会导致目标路由（初始路由）无限长时间加载后，router的初始化过程也是无限长的，整个路由始终不渲染，重定向到的路由也不渲染。
           * 所以这里还获取了router的对象，通过设置其inited为true，强制其初始化完成，使得路由能够完成渲染。
           */
          const { current } = routerRef
          if (!current.inited) {
            current.inited = true
          }
          hidePageLoading(true)
          history.replace(redirectPath)
          await new Promise(() => {})

          return data
        },
      })
    }, [])
    return null
  })
)
