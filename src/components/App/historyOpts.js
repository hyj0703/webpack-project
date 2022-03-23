import { getQuery } from '@jmdd/jmdd-url'

export default {
  preferPreventQuit: true, //尝试开启history的退出拦截功能
  defToMode: 'newPage', //默认以新开页面的方式跳转
  beforeProcessStackAndIdx() {
    //start:使用query上的stack指定初始栈
    const stackStr = getQuery('stack')
    let stack
    try {
      stack = JSON.parse(stackStr)
    } catch (e) {}
    return {
      stack,
      idx: stack ? stack.length - 1 : undefined,
    }
    //end:使用query上的stack指定初始栈
  },
}
