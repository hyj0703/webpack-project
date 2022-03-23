import { setQuery } from '@jmdd/jmdd-url'

/**
 * 唤起商城
 */
export default function callSc() {
  location.href = setQuery(
    'openapp.jdmobile://virtual',
    'params',
    JSON.stringify({ category: 'jump', des: 'HomePage' })
  )
}
