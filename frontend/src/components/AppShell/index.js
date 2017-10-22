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
    const styles = {margin: 10}
    let loggedInNav

    const publicAndPrivate = (
      <span>
        <Link to={`/about`} style={styles}>
          About
        </Link>
      </span>
    )

    if (isAuthed) {
      loggedInNav = (
        <span>
          <Link to={`/`} style={styles}>
            Home
          </Link>
          <Link to={`/forms/`} style={styles}>
            Forms
          </Link>
          <Link to={`/profile/`} style={styles}>
            Profile
          </Link>
          <Link to={`/akjdakldjlkjdlkdja/`} style={styles}>
            404 link
          </Link>
          <button className="btn-margin" onClick={auth.logout} style={styles}>
            Log Out
          </button>
          <br/><br/><button onClick={this.simulateNoAuth}>Simulate no auth</button>
        </span>
      )
    }
    let loggedOutNav
    if (!isAuthed) {
      loggedOutNav = (
        <span>
          <button className="btn-margin" onClick={this.logIn} style={styles}>
            Log In
          </button>
          <Link to={`/profile/`} style={styles}>
            Profile (protected)
          </Link>
          <Link to={`/lsdkakdllakd/`} style={styles}>
            404 link
          </Link>
        </span>
      )
    }

    return (
      <div>
        {publicAndPrivate}
        {loggedInNav}
        {loggedOutNav}
        <br/><br/>
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
