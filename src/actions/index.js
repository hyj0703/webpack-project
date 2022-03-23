import * as demo from './demo' //TODO 演示用，可删除

import * as popup from './popup'
import * as retry from './retry'

import { format } from './utils'

export default {
  popup: format(popup),
  retry: format(retry),
  demo: format(demo), //TODO 演示用，可删除
}
