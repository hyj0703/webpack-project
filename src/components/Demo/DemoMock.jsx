import React from 'react'
import { connect } from 'react-redux'
import './DemoMock.scss'

export default connect(({ demo: { users } }) => ({
  users,
}))(function DemoMock({ users }) {
  return (
    <div className="demo-mock">
      {users.map(({ nickname, avatar }) => (
        <p className="demo-mock__user" key={nickname}>
          <img className="demo-mock__avatar" src={avatar} />
          <span className="demo-mock__nickname">{nickname}</span>
        </p>
      ))}
    </div>
  )
})
