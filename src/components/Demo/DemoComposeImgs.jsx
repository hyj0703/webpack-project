import React from 'react'
import composeImgs from '../../utils/img/composeImgs'
import './DemoComposeImgs.scss'

export default function DemoComposeImgs() {
  return (
    <button
      onClick={async () => {
        try {
          const src = await composeImgs({
            height: 500,
            width: 500,
            imgInfos: [
              {
                src: '//m.360buyimg.com/babel/jfs/t1/41193/19/15568/2918/613080c3E3480b324/8fd90a2af4470217.png',
                x: 125,
                y: 125,
                scaleX: 0.5,
                scaleY: 0.5,
              },
              {
                src: '//m.360buyimg.com/babel/jfs/t1/189896/4/21062/5119/613080fcEe7fc079b/d674fadba9e60db2.png',
                x: 125,
                y: 375,
                scaleX: 0.5,
                scaleY: 0.5,
              },
              {
                src: '//m.360buyimg.com/babel/jfs/t1/197067/23/6135/6311/61308107E389bcdf9/d862df36be65d3ed.png',
                x: 375,
                y: 125,
                scaleX: 0.5,
                scaleY: 0.5,
              },
              {
                src: '//m.360buyimg.com/babel/jfs/t1/192855/12/21550/3310/6130811aE1aa716a1/3739ebf112234e37.png',
                x: 375,
                y: 375,
                scaleX: 0.5,
                scaleY: 0.5,
              },
            ],
            timeout: 10000,
          })
          console.log(
            '%c ',
            `background:url(https:${src}) center no-repeat;background-size:contain;font-size:100px;`
          )
          alert('合成成功')
        } catch (e) {
          console.log(e)
          alert('合成失败')
        }
      }}>
      合成图片
    </button>
  )
}
