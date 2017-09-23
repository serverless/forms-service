import React, { Component } from 'react'
import './App.css'

class App extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }
  login = () => {
    this.props.auth.login()
  }
  logout = () => {
    this.props.auth.logout()
  }
  renderNav() {
    const { isAuthenticated } = this.props.auth
    let loggedInNav, loggedOutNav
    if (isAuthenticated()) {
      loggedInNav = (
        <div>
          <button className="btn-margin" onClick={this.goTo.bind(this, 'forms')}>
            Forms
          </button>
          <button className="btn-margin" onClick={this.goTo.bind(this, 'profile')}>
            Profile
          </button>
          <button className="btn-margin" onClick={this.logout}>
            Log Out
          </button>
        </div>
      )
    } else {
      loggedOutNav = (
        <div>
          <button className="btn-margin" onClick={this.login}>
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
    const { isAuthenticated } = this.props.auth
    const authedTrue = isAuthenticated()
    let renderLoginButton
    if (!authedTrue) {
      renderLoginButton = (
        <div>
          <h3>You will need to login to use the app</h3>
          <button className="btn-margin" onClick={this.login}>
            Log In
          </button>
        </div>
      )
    }

    return (
      <div>
        <div>
          {this.renderNav()}
        </div>
        <div className="App-header">
          <h2>Serverless Form Manager</h2>
        </div>
        <div className="container">
          {this.props.children}
          {renderLoginButton}
        </div>
      </div>
    )
  }
}

export default App
