import auth0 from 'auth0-js'
import lockInstance from './authInstance'
import queryString from 'query-string'
import decode from 'jwt-decode'
import history from './history'
import { config } from '../_config'
import { getXsrfToken, clearXsrfToken } from './xsrf'

const AUTH_CONFIG = config.auth0

export default class Auth {
  auth0 = lockInstance();

  constructor() {
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.isAuthed = this.isAuthed.bind(this)
  }

  login() {
    const token = getXsrfToken()
    const location = encodeURIComponent(window.location.href)
    const state = `token=${token}&url=${location}`
    console.log('state', state)
    debugger;
    this.auth0.authorize({
      state: state
    })
  }

  handleAuthentication() {
    var count = 0
    console.log('auth0.parseHash ran')
    console.log('auth0.parseHash count', count + 1)
    alert(`parseHash called cound ${count + 1}`)

    this.auth0.parseHash((err, authResult) => {

      if (err) {
        console.log('err', err)
        alert(JSON.stringify((err)))
        console.log('authResult', authResult)
        debugger;
      }

      if (authResult && authResult.accessToken && authResult.idToken) {
        //console.log('authResult', authResult)
        this.setSession(authResult)
        history.replace('/')
      } else if (err) {
        history.replace('/')
        console.log(err)
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
    });
  }

  setSession(authResult) {
    console.log(authResult);
    console.log('authResult', authResult)
    console.log(authResult.state)
    // debugger
    const token = getXsrfToken()
    const state = queryString.parse(authResult.state)
    console.log('state', state)
    console.log('state.token', state.token)
    console.log('token', token)
    debugger
    if (state.token !== token) {
      // reset token
      clearXsrfToken()
      alert('Your Security token expired. Please login again')
      // redirect to previous page
      window.location.href = state.url
      return false
    }
    if (authResult && authResult.accessToken && authResult.idToken) {

      const role = this.getRole(authResult.idToken)

      if (!role) {
        alert('Roles not used in app. Update auth0 rules')
        return false
      }


      if (!role.length || !this.isAdmin(role)) {
        alert('Sorry you are not an admin of this app! Please contact admin')
        // no role
        return false
      }
      // Set the time that the access token will expire at
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      )
      localStorage.setItem('access_token', authResult.accessToken)
      localStorage.setItem('id_token', authResult.idToken)
      localStorage.setItem('expires_at', expiresAt)
      // navigate to the forms route
      history.replace('/forms/')
    }
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken()
    console.log('check', accessToken)
    this.auth0.client.userInfo(accessToken, function(err, user) {
      if (err) {
        console.log('err', err)
      }
      console.log(user)
      if (user) {
        // this.userProfile = user
      }
      if (cb && typeof cb === 'function') {
        return cb(err, user)
      }
      // Now you have the user's information
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }

  isAuthed() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  isAdmin(rolesArray) {
    return rolesArray.indexOf('admin') > -1
  }

  getRole(token) {
    const namespace = 'https://serverless.com'
    const idToken = token || localStorage.getItem('id_token')
    if (!idToken) {
      return null
    }
    console.log('yes')
    const decoded = decode(idToken)
    console.log('decode', decoded)
    console.log(typeof decoded)
    return decode(idToken)[`${namespace}/roles`] || null
  }
}
