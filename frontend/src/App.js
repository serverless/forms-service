import React, { Component } from 'react'

class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }
  renderNavigation() {
    const { auth } = this.props
    const authed = auth.isAuthenticated()
    let loggedInNav
    if (authed) {
      loggedInNav = (
        <div>
          <button className="btn-margin" onClick={this.goTo.bind(this, 'forms')}>
            Forms
          </button>
          <button className="btn-margin" onClick={this.goTo.bind(this, 'profile')}>
            Profile
          </button>
          <button className="btn-margin" onClick={auth.logout}>
            Log Out
          </button>
        </div>
      )
    }
    let loggedOutNav
    if (!authed) {
      loggedOutNav = (
        <div>
          <button className="btn-margin" onClick={auth.login}>
            Log In
          </button>
        </div>
      )
    }

    return (
      <div>
        {loggedInNav}
        {loggedOutNav}
      </div>
    )
  }
  render() {
    const { auth, children } = this.props
    let loginButton
    if (!auth.isAuthenticated()) {
      loginButton = (
        <div>
          <h3>You will need to login to use the app</h3>
          <button className="btn-margin" onClick={auth.login}>
            Log In
          </button>
        </div>
      )
    }
    return (
      <div>
        {this.renderNavigation()}
        <div className="App-header">
          <h2>Serverless Form Manager</h2>
        </div>
        <div className="container">
          {children}
          {loginButton}
        </div>
      </div>
    )
  }
}

export default App
