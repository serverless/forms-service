import React, { Component } from 'react'
import AppLayout from '../../fragments/AppLayout'

export default class Profile extends Component {

  render() {
    const { profile } = this.props

    if (!profile) {
      return <div>Loading</div>
    }

    const image = (profile.picture) ? <img src={profile.picture} alt="profile" /> : null

    let nickname
    if (profile.picture) {
      nickname = (
        <div>
          Nickname
          <h3>{profile.nickname}</h3>
        </div>
      )
    }

    return (
      <AppLayout>
        <h1>{profile.name}</h1>
        <div>
          {image}
          {nickname}
        </div>
        <div>
          <h2>User data from JWT</h2>
          <pre>
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      </AppLayout>
    )
  }
}
