import React, { Component } from 'react'
import AppLayout from '../../fragments/AppLayout'

export default class Profile extends Component {

  render() {
    const { profile } = this.props

    if (!profile) {
      return <div>Loading</div>
    }

    return (
      <AppLayout>
        <h1>{profile.name}</h1>
        <div>
          <img src={profile.picture} alt="profile" />
          <div>
            Nickname
            <h3>{profile.nickname}</h3>
          </div>
          <pre>
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      </AppLayout>
    )
  }
}
