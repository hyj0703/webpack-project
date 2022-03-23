import { setQueries } from '@jmdd/jmdd-url'

/**
 * 唤起金融
 * @see {@link https://cf.jd.com/pages/viewpage.action?pageId=75271446}
 * @see {@link https://cf.jd.com/pages/viewpage.action?pageId=356335602}
 * @param {String} url - 唤起金融app后打开的页面，若为falsy值，则打开金融app首页
 */
export default function callJr(url) {
  location.href = `openjdjrapp:${
    url ? setQueries(url.replace(/^\w+:\/\//, '//'), { jrcontainer: 'h5' }) : ''
  }`
}
