import toast from '@jmdd/jmdd-toast'
import React from 'react'
import { addRemind, checkRemind, removeRemind } from '../../utils/remind'
import './DemoRemind.scss'

export default function DemoRemind() {
  const opts = {
    id: '20210521', //日历提醒的id，每种日历提醒的id均需不同
    startTime: '2021-10-11 10:00:00', //日历提醒的开始时间，即“用户收到日历提醒消息”的时间
    endTime: '2021-10-12 00:00:00', //日历提醒的结束时间，仅在日历中绘制日历提醒时间段时有用，建议在签到玩法中设置为当天晚上24点；在多人玩法中设置为当天晚上10点。若不传，默认为startTime当天晚上24点。
    title: '日历提醒的标题', //日历提醒的标题
    url: '//m.jd.com', //日历提醒后打开的链接
    tag: '日历提醒的标签（不超过4个字符）', //日历提醒的标签（不超过4个字符，超过的会被截断）
  } //日历提醒的入参
  return (
    <>
      <button onClick={() => addRemind(opts)}>添加日历提醒</button>
      <br />
      <button onClick={() => removeRemind(opts)}>删除日历提醒</button>
      <br />
      <button
        onClick={async () => {
          try {
            toast({
              txt: `是否已添加日历提醒：${await checkRemind(opts)}`,
              icon: 'info',
            })
          } catch (e) {
            toast({
              txt: `查询是否已添加日历提醒失败（${e}）`,
              icon: 'fail',
            })
          }
        }}>
        是否已添加日历提醒
      </button>
    </>
  )
}
