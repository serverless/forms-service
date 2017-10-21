import React from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import AppShell from './components/AppShell'
import FormList from './components/FormList'
import FormView from './components/FormView'
import Profile from './components/UserProfile'
import * as userActions from './redux/user'
import { auth } from './redux/user'
import { connect } from 'react-redux'

const ComponentOne = ({ location }) => (
  <div>
    <h3>1</h3>
  </div>
)

const ComponentTwo = ({ location }) => (
  <div>
    <h3>2</h3>
  </div>
)

class App extends React.Component {
  componentWillMount() {
    this.loadProfile()
  }
  loadProfile = () => {
    const { isAuthed, dispatch } = this.props
    if (isAuthed) {
      auth.getProfile((err, profile) => {
        if (err) {
          // error with token or auth0 reset client
          // return dispatch(userActions.logout())
        }
        // profile recieved from auth0, set profile
        return dispatch(userActions.loginSuccess(profile))
      })
    }
  }
  render () {
    const props = this.props
    console.log('propspropspropsprops', props)

    if (props.loading || props.location.pathname === '/callback') {
      // return <div>Loading...</div>
    }
    // Route View Components
    const appShell = (p) => <AppShell isAuthed={props.isAuthed} auth={auth} {...p} />
    const dashboard = (p) => <div>dashboard</div>
    const profile = (p) => <Profile profile={props.profile} {...p} />

    return (
      <div>
        <Route path="/" render={appShell} />
        <Switch>
          <Route {...props} render={(p) => {
            // loading state
            if (props.loading || props.location.pathname === '/callback') {
              return <div>Loading...</div>
            }

            // Protected routes
            if (props.isAuthed) {
              return (
                <Switch>
                  <Route path={`/`} exact render={dashboard} />
                  <Route path={`/forms`} exact component={FormList} />
                  <Route path={`/forms/:id`} component={FormView} />
                  <Route path={`/profile`} render={profile} />
                  <Redirect to={`/`} />
                </Switch>
              )
            }

            // non-authed routes
            return (
              <Switch>
                <Route path={`/`} exact component={ComponentOne} />
                <Route path={`/2`} exact component={ComponentTwo} />
                <Redirect to={`/`} />
              </Switch>
            )
          }}
          />
        </Switch>
        {/* 404 back home */}
      </div>
    )
  }
}

const stateToProps = ({ user }) => ({
  profile: user.profile,
  loading: user.loading,
  isAuthed: user.isAuthenticated
})

export default withRouter(connect(stateToProps)(App))
