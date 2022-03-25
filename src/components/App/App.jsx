import { Router, Switch } from '@jmdd/jmdd-react-router'
import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from 'swiper'
import 'swiper/components/pagination/pagination.min.css'
import 'swiper/swiper.min.css'
import store from '../../store'
import CommonErrHandler from '../CommonErrHandler/CommonErrHandler'
import Demo from '../Demo/Demo' //TODO 演示用，可删除
import KeySharePanel from '../KeySharePanel/KeySharePanel'
import Initing from '../Initing/Initing'
import PkMain from '../PkMain/PkMain'
import './App.scss'
import historyOpts from './historyOpts'

SwiperCore.use([Autoplay, EffectCoverflow, Pagination])

export default function App() {
  const routerRef = useRef()
  return (
    <Provider store={store}>
      <CommonErrHandler routerRef={routerRef} />
      <Router
        initingStackItem="/initing"
        historyOpts={historyOpts}
        ref={routerRef}>
        <Switch>
          <Initing />
          {/* TODO 演示用，可删除 */}
          <Demo />
          <PkMain />

          {/* 其他的路由可以放在这里 */}

          {/* 其他的路由可以放在这里 */}
        </Switch>
      </Router>

      <KeySharePanel />
    </Provider>
  )
}
