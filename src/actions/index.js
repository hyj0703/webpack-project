import * as demo from './demo' //TODO 演示用，可删除

import * as popup from './popup'
import * as retry from './retry'
import * as pk from './pk'

import { format } from './utils'
export default {
  popup: format(popup),
  retry: format(retry),
  pk: format(pk),
  demo: format(demo), //TODO 演示用，可删除
}
