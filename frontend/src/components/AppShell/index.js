import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as userActions from '../../redux/user'
import { connect } from 'react-redux'

class AppContainer extends Component {
  constructor (props, context) {
    super(props, context)
    console.log('app props', props)
    this.state = {
      sideNavOpen: false
    }
  }
  componentWillMount() {
    const { getProfile } = this.props.auth
    const { isAuthed } = this.props
    console.log('here')
    if (isAuthed) {
      getProfile((err, profile) => {
        console.log('profilez', profile)

      })
    }
  }
  simulateNoAuth() {
    const access = localStorage.getItem('access_token')
    const idToken = localStorage.getItem('id_token')
    localStorage.setItem('access_token', `x${access}`)
    localStorage.setItem('id_token', `x${idToken}`)
  }
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }
  logIn = () => {
    const { dispatch } = this.props
    return dispatch(userActions.login())
  }
  renderNavigation() {
    const { auth, isAuthed } = this.props
    let loggedInNav
    if (isAuthed) {
      loggedInNav = (
        <div style={{display: 'flex'}}>
          <Link to={`/`}>
            Home
          </Link>
          <Link to={`/forms/`}>
            Forms
          </Link>
          <Link to={`/profile/`}>
            Profile
          </Link>
          <Link to={`/akjdakldjlkjdlkdja/`}>
            404 link
          </Link>
          <button className="btn-margin" onClick={auth.logout}>
            Log Out
          </button>
        </div>
      )
    }
    let loggedOutNav
    if (!isAuthed) {
      loggedOutNav = (
        <div>
          <button className="btn-margin" onClick={this.logIn}>
            Log In
          </button>
          <Link to={`/profile/`}>
            Profile (protected)
          </Link>
          <Link to={`/lsdkakdllakd/`}>
            404 link
          </Link>
        </div>
      )
    }

    return (
      <div>
        {loggedInNav}
        {loggedOutNav}
        <button onClick={this.simulateNoAuth}>Simulate no auth</button>
      </div>
    )
  }
  render() {
    return (
      <div>
        {this.renderNavigation()}
        <div className="App-header">
          <h2>Serverless Form Manager</h2>
        </div>
      </div>
    )
  }
}


const App = connect()(AppContainer)

export default App
