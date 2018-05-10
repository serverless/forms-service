import React from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import NavBar from './fragments/NavBar'
import AppLayout from './fragments/AppLayout'
import FormList from './pages/FormList'
import FormView from './pages/FormView'
import FormSettings from './pages/FormSettings'
import Profile from './pages/UserProfile'
import Welcome from './pages/Welcome'
import Loading from './pages/Loading'
import NotFound from './pages/NotFound'
import * as userActions from './redux/user'
import { auth } from './redux/user'
import { connect } from 'react-redux'

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication()
  }
}

class App extends React.Component {
  componentWillMount() {
    this.checkLogin()
  }
  logIn = () => {
    const { dispatch } = this.props
    return dispatch(userActions.login())
  }
  checkLogin = () => {
    const { isAuthed, dispatch } = this.props
    if (isAuthed) {
      auth.getProfile((err, profile) => {
        if (err) {
          // clear old tokens
          return dispatch(userActions.logout())
        }
        // profile recieved from auth0, set profile
        return dispatch(userActions.loginSuccess(profile))
      })
    }
  }
  render () {
    const props = this.props
    // Route View Components
    const navBar = (p) => <NavBar isAuthed={props.isAuthed} auth={auth} {...p} />
    const dashboardRedirect = (p) => <Redirect to={`/forms`} />
    const profile = (p) => <Profile profile={props.profile} {...p} />

    return (
      <div className='app-wrapper'>
        <Route path="/" render={navBar} />
        <Switch>
          <Route path="/callback" render={(props) => {
            // parse auth hash
            handleAuthentication(props)
            return <Loading />
          }} />
          <Route path={`/about`} exact component={PublicRoute} />
          <Route {...props} render={(p) => {
            // loading state
            if (props.loading || props.location.pathname === '/callback') {
              return <Loading />
            }

            // non-authed routes
            if (!props.isAuthed) {
              return (
                <Switch>
                  <Route path={`/`} exact component={Welcome} />
                  <Route path={`/public`} exact component={PublicRoute} />
                  {/* <Redirect to={`/`} /> */}
                  <Route render={() => <PleaseLogin logIn={this.logIn} {...props} />}  />
                </Switch>
              )
            }

            // Protected routes
            return (
              <Switch>
                <Route path={`/`} exact render={dashboardRedirect} />
                <Route path={`/forms`} exact component={FormList} />
                <Route path={`/forms/:id/settings`} component={FormSettings} />
                <Route path={`/forms/:id`} component={FormView} />
                <Route path={`/profile`} render={profile} />
                {/* <Redirect to={`/`} /> */}
                <Route component={NotFound} />
              </Switch>
            )
          }}
          />
        </Switch>
      </div>
    )
  }
}

const PublicRoute = ({ location }) => (
  <div className="container">
    <h3>About this application</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae mauris arcu, eu pretium nisi. Praesent fringilla ornare ullamcorper. Pellentesque diam orci, sodales in blandit ut, placerat quis felis. Vestibulum at sem massa, in tempus nisi. Vivamus ut fermentum odio. Etiam porttitor faucibus volutpat. Vivamus vitae mi ligula, non hendrerit urna. Suspendisse potenti. Quisque eget massa a massa semper mollis.</p>
  </div>
)

const PleaseLogin = (props) => {
  console.log('props', props)
  const path = props.location.pathname
  // if known protected routes, ask for login.
  if (path.match(/profile/) || path.match(/forms/)) {
    return (
      <AppLayout>
        <h3>You must be logged in to view this page</h3>
        <button className="grey-btn" onClick={props.logIn}>
          Log In
        </button>
      </AppLayout>
    )
  }
  // else show 404
  return <NotFound {...props} />
}

const stateToProps = ({ user }) => ({
  profile: user.profile,
  loading: user.loading,
  isAuthed: user.isAuthenticated
})

export default withRouter(connect(stateToProps)(App))
