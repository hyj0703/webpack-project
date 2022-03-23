import AfterBack from '@jmdd/jmdd-after-back'
import { isIos } from '@jmdd/jmdd-envs'
import ping from '@jmdd/jmdd-ping'
import {
  setToMpCore,
  setToOpenAppCore,
  setToUpgradeCore,
  to,
} from '@jmdd/jmdd-to'
import { complete, setQueries } from '@jmdd/jmdd-url'
import { nativeCall } from '@jmfe/jm-webview'
import isJr from '../isJr'
import afterBackAdapt from './jmdd-jr-adapter-after-back'
import envsAdapt from './jmdd-jr-adapter-envs'
import versionsAdapt from './jmdd-jr-adapter-versions'
import visibleByJdAdapt from './jmdd-jr-adapter-visible-by-jd'

let adapted = !isJr() //是否已适配

/**
 * 适配
 * @returns 适配完成
 */
export default function adapt() {
  if (!adapted) {
    adapted = true
    if (isJr()) {
      envsAdapt()
      versionsAdapt()
      visibleByJdAdapt()
      afterBackAdapt()
      setToOpenAppCore((openAppParams) => {
        const { des, modulename, couponId, url, skuId, shopId } = openAppParams
        switch (des) {
          case 'jdreactcommon': {
            switch (modulename) {
              case 'JDReactShanGou': {
                JrBridge.openScheme({
                  schemeUrl: setQueries(
                    complete('//wqs.jd.com/portal/wx/seckill_m/brand.shtml'),
                    { jrcontainer: 'h5' }
                  ),
                })
                break
              }
              case 'JDReactMyRedEnvelope': {
                JrBridge.openScheme({
                  schemeUrl: setQueries(
                    complete('//wqs.jd.com/my/redpacket.shtml'),
                    { jrcontainer: 'h5', jrlogin: true }
                  ),
                })
                break
              }
              default: {
                nativeCall('virtual', openAppParams)
              }
            }
            break
          }
          case 'mycoupon': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete('//home.m.jd.com/wallet/coupons.action'),
                {
                  jrcontainer: 'h5',
                  jrlogin: true,
                }
              ),
            })
            break
          }
          case 'couponCenter': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete('//coupon.m.jd.com/center/getCouponCenter.action'),
                { jrcontainer: 'h5' }
              ),
            })
            break
          }
          case 'productList': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete(
                  `//so.m.jd.com/list/couponSearch.action?couponbatch=${couponId}`
                ),
                { jrcontainer: 'h5' }
              ),
            })
            break
          }
          case 'HomePage': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                'openjdjrapp://com.jd.jrapp/main/homepage',
                { jrcontainer: 'native' }
              ),
            })
            break
          }
          case 'm': {
            JrBridge.openScheme({
              schemeUrl: setQueries(url, { jrcontainer: 'h5' }),
            })
            break
          }
          case 'productDetail': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete(`//q.jd.com/m/xj/index.html?skuId=${skuId}`),
                { jrcontainer: 'h5' }
              ),
            })
            break
          }
          case 'jshopMain': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete(
                  `//shop.m.jd.com/mshop/gethomepage?venderid=${shopId}`
                ),
                { jrcontainer: 'h5' }
              ),
            })
            break
          }
          case 'cartB': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                'openjdjrapp://com.jd.jrapp/kpl/shoppingcart',
                { jrcontainer: 'native', jrlogin: true }
              ),
            })
            break
          }
          case 'seckill': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete('//wqs.jd.com/portal/wx/seckill_m/cate.shtml'),
                { jrcontainer: 'h5' }
              ),
            })
            break
          }
          case 'paritySeckill': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete('//wqs.jd.com/portal/wx/seckill_m/specialprice.shtml'),
                { jrcontainer: 'h5' }
              ),
            })
            break
          }
          case 'myJd': {
            JrBridge.openScheme({
              schemeUrl: setQueries(
                complete('//home.m.jd.com/myJd/newhome.action'),
                { jrcontainer: 'h5', jrlogin: true }
              ),
            })
            break
          }
          default: {
            nativeCall('virtual', openAppParams)
          }
        }
      })
      setToMpCore(({ id, path }, pingOpts, { onBack }) => {
        ping(pingOpts)
        if (onBack) {
          new AfterBack({
            cb() {
              onBack()
            },
          }).start()
        }
        JrBridge.openScheme({
          schemeUrl: setQueries(
            'openjdjrapp://com.jd.jrapp/appcommon/wxminiprogram/openprogram',
            {
              jrcontainer: 'native',
              jrlogin: true,
              jrproductid: id,
              jrparam: encodeURIComponent(
                JSON.stringify({
                  type: path,
                })
              ),
            }
          ),
        })
      })
      setToUpgradeCore((pingOpts, extra) => {
        to({
          pingOpts,
          extra,
          mUrl: isIos()
            ? '//itunes.apple.com/cn/app/jing-dong-jin-rong/id895682747'
            : '//m.jr.jd.com/udownload/index.html',
        })
      })
    }
  }
}
