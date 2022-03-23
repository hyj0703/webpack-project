import store from '../store'
import { ADD_COUNT_DOWN } from '../actions/countDown'

export default function getCountDown({ handler, count }) {
  store.dispatch({
    type: ADD_COUNT_DOWN.type,
    payload: { handler, count },
  })
}

export function getHour(time) {
  let hour = time - 8
  hour = hour > 9 ? hour : '0' + hour
  return hour
}
