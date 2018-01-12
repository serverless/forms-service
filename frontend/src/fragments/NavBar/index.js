import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as userActions from '../../redux/user'
import { simulateNoAuth } from '../../utils/auth'
import { connect } from 'react-redux'

class NavBar extends Component {
  logIn = () => {
    const { dispatch } = this.props
    return dispatch(userActions.login())
  }
  render() {
    const { auth, isAuthed } = this.props
    const styles = { margin: 15 }

    let leftNav = (
      <div>
        <Link to={`/profile/`} style={styles}>
          Profile (protected)
        </Link>
        <Link to={`/lsdkakdllakd/`} style={styles}>
          404 link
        </Link>
      </div>
    )

    let rightNav = (
      <span className='right-nav-contents'>
        <a href="https://github.com/serverless/forms-service">
          View on Github
        </a>
        <button className="btn-margin" onClick={this.logIn}>
          Log In
        </button>
      </span>
    )

    if (isAuthed) {
      leftNav = (
        <span>
          <Link to={`/forms/`} style={styles}>
            Forms
          </Link>
          <Link to={`/profile/`} style={styles}>
            Profile
          </Link>
          <Link to={`/akjdakldjlkjdlkdja/`} style={styles}>
            404 link
          </Link>
        </span>
      )
      rightNav = (
        <span>
          <button onClick={simulateNoAuth}>
            Mangle JWT Token
          </button>
          <button className="btn-margin" onClick={auth.logout} style={styles}>
            Log Out
          </button>
        </span>
      )
    }

    return (
      <div>
        <nav className='navbar'>
          <div className='left-nav'>
            <Link className='logo' title='logo' to='/'>
              <img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless_logotype_1500x500%401x-white.png"/>
            </Link>
            {leftNav}
          </div>
          <div className='right-nav'>
            {rightNav}
          </div>
        </nav>
        <div className='navbar-spacer' />
      </div>
    )
  }
}


const NavBarWithData = connect()(NavBar)

export default NavBarWithData
