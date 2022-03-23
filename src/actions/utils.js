/**
 * 是否是generator函数
 * @param {*} obj
 * @returns {Boolean} 是否是generator函数
 */
function isGeneratorFunction({ constructor }) {
  if (!constructor) {
    return false
  }
  const { name, displayName } = constructor
  if (name === 'GeneratorFunction' || displayName === 'GeneratorFunction') {
    return true
  }
  const { prototype } = constructor
  return (
    typeof prototype.next === 'function' &&
    typeof prototype.throw === 'function'
  )
}

/**
 * 格式化
 * @param {Object} actions
 * @returns {Object} 由def、reducers和sagas组成的对象
 */
export function format(actions) {
  const reducers = {}
  const sagas = {}
  let def = {}
  for (let type in actions) {
    const action = actions[type]
    if (type === 'default') {
      def = action
    } else if (typeof action === 'function') {
      action.type = type
      if (isGeneratorFunction(action)) {
        sagas[type] = action
      } else {
        reducers[type] = action
      }
    }
  }
  return { def, reducers, sagas }
}
