import React from 'react'
import loadImgs from '../../utils/img/loadImgs'
import './DemoLoadImgs.scss'

export default function DemoLoadImgs() {
  return (
    <button
      onClick={async () => {
        try {
          await loadImgs({
            srcs: [
              '//m.360buyimg.com/babel/jfs/t1/41193/19/15568/2918/613080c3E3480b324/8fd90a2af4470217.png',
              '//m.360buyimg.com/babel/jfs/t1/189896/4/21062/5119/613080fcEe7fc079b/d674fadba9e60db2.png',
              '//m.360buyimg.com/babel/jfs/t1/197067/23/6135/6311/61308107E389bcdf9/d862df36be65d3ed.png',
            ],
          })
          alert('加载成功')
        } catch (e) {
          alert('加载失败')
        }
      }}>
      加载图片
    </button>
  )
}
