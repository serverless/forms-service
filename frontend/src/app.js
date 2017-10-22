import React from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import AppShell from './components/AppShell'
import FormList from './components/FormList'
import FormView from './components/FormView'
import Profile from './components/UserProfile'
import * as userActions from './redux/user'
import { auth } from './redux/user'
import { connect } from 'react-redux'



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
          // TODO maybe just show login button again?
          return dispatch(userActions.logout())
        }
        // profile recieved from auth0, set profile
        return dispatch(userActions.loginSuccess(profile))
      })
    }
  }
  render () {
    const props = this.props
    // console.log('propspropspropsprops', props)

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
          <Route path={`/about`} exact component={PublicRoute} />
          <Route {...props} render={(p) => {
            // loading state
            if (props.loading || props.location.pathname === '/callback') {
              return <div>Loading...</div>
            }

              // non-authed routes
            if (!props.isAuthed) {
              return (
                <Switch>
                  <Route path={`/`} exact component={Welcome} />
                  <Route path={`/public`} exact component={PublicRoute} />
                  {/* <Redirect to={`/`} /> */}
                  <Route component={PleaseLogin} />
                </Switch>
              )
            }

            // Protected routes
            return (
              <Switch>
                <Route path={`/`} exact render={dashboard} />
                <Route path={`/forms`} exact component={FormList} />
                <Route path={`/forms/:id`} component={FormView} />
                <Route path={`/profile`} render={profile} />
                {/* <Redirect to={`/`} /> */}
                <Route component={NoMatch} />
              </Switch>
            )
          }}
          />
        </Switch>
      </div>
    )
  }
}

const Welcome = ({ location }) => (
  <div>
    <h3>Welcome to the app</h3>
  </div>
)

const PublicRoute = ({ location }) => (
  <div>
    <h3>About this application</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae mauris arcu, eu pretium nisi. Praesent fringilla ornare ullamcorper. Pellentesque diam orci, sodales in blandit ut, placerat quis felis. Vestibulum at sem massa, in tempus nisi. Vivamus ut fermentum odio. Etiam porttitor faucibus volutpat. Vivamus vitae mi ligula, non hendrerit urna. Suspendisse potenti. Quisque eget massa a massa semper mollis.</p>
  </div>
)

const PleaseLogin = (props) => {
  const path = props.location.pathname
  // if known protected routes, ask for login.
  if (path.match(/profile/) || path.match(/forms/)) {
    return (
      <div>
        <h3>You must be logged in to view this page</h3>
      </div>
    )
  }
  // else show 404
  return <NoMatch {...props} />
}

const NoMatch = ({ location }) => {
  return (
    <div>
      <h3>No match for <code>{location.pathname}</code></h3>
    </div>
  )
}

const stateToProps = ({ user }) => ({
  profile: user.profile,
  loading: user.loading,
  isAuthed: user.isAuthenticated
})

export default withRouter(connect(stateToProps)(App))
