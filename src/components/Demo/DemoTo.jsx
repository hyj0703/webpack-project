import {
  toAny,
  toCart,
  toCouponBatch,
  toCouponCenter,
  toHome,
  toLogin,
  toMp,
  toMyCoupon,
  toMyJd,
  toMyRedbag,
  toOpenAppOrPage,
  toPage,
  toProduct,
  toSeckill,
  toShop,
  toSkin,
  toUpgrade,
} from '@jmdd/jmdd-to'
import React from 'react'
import './DemoTo.scss'

export default function DemoTo() {
  return (
    <>
      {[
        { api: toMyCoupon, name: '我的优惠券' },
        {
          api: toCouponCenter,
          name: '领券中心',
        },
        { api: toCouponBatch, args: ['192334782'], name: '券购页' },
        { api: toLogin, args: ['//m.jd.com'], name: '登录' },
        { api: toHome, name: '首页' },
        { api: toPage, args: ['//m.jd.com'], name: '指定页面' },
        {
          api: toOpenAppOrPage,
          args: [
            'openApp.jdMobile://virtual?params={"category":"jump","des":"cartB"}',
          ],
          name: 'openApp或指定页面',
        },
        { api: toProduct, args: ['11675023'], name: '商详' },
        { api: toShop, args: ['1000004235'], name: '店铺' },
        { api: toCart, name: '购物车' },
        { api: toMyRedbag, name: '我的红包' },
        { api: toUpgrade, name: '升级页' },
        { api: toSeckill, args: ['jd'], name: '秒杀' },
        { api: toSkin, args: ['201903080001'], name: '皮肤详情' },
        { api: toMyJd, name: '我的京东' },
        {
          api: toMp,
          args: [
            {
              id: 'gh_45b306365c3d',
              path: '/pages/index/index',
              version: 'release',
            },
          ],
          name: '小程序',
        },
        { api: toAny, args: ['myCoupon'], name: '任意可识别的地址' },
      ].map(({ api, args = [], name }) => (
        <button
          key={name}
          onClick={() =>
            api(...args, {
              onBack() {
                console.log(`从${name}返回`)
              },
            })
          }>
          跳转到{name}
        </button>
      ))}
    </>
  )
}
