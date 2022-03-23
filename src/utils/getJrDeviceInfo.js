import { JR_VALIDATE_APP_ID, JR_VALIDATE_SCENE } from '../constants/task'

const promise = new Promise((resolve) => setTimeout(resolve, 1000))

/**
 * 获取金融设备信息
 */
export default async function getJrDeviceInfo() {
  await promise
  let eid
  let sdkToken
  for (let i = 0, len = 10; i < len; i++) {
    try {
      const { eid: tmpEid, sdkToken: tmpSdkToken } = getJdEid()
      if (tmpEid && tmpSdkToken) {
        eid = tmpEid
        sdkToken = tmpSdkToken
        break
      }
    } catch (e) {}
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  return { eid, sdkToken }
}

/**
 * 获取金融滑块验证信息
 */
export async function getJrValidateInfo() {
  let validateData = ''
  if (typeof initJdSlide === 'function') {
    return Promise.race([
      new Promise((resolve, reject) => {
        try {
          console.log('initJdSlide', initJdSlide)
          initJdSlide(
            {
              id: 'jrValidate',
              appId: JR_VALIDATE_APP_ID,
              scene: JR_VALIDATE_SCENE,
            },
            function (obj) {
              validateData = obj.getValidate() //滑动成功才返回validate,处理业务
              resolve(validateData)
            }
          )
        } catch (error) {
          console.log(error)
          reject('')
        }
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, 10000)
      }),
    ])
  }
}
