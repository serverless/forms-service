import React from 'react'
import { Redirect, Route, BrowserRouter } from 'react-router-dom'
import App from './App'
import FormList from './components/FormList'
import FormView from './components/FormView'
import Profile from './components/profile'
import Callback from './components/callback'
import Auth from './utils/auth'

const auth = new Auth()

export const makeMainRoutes = () => {
  const isAuthed = auth.isAuthenticated()

  // Route View Components
  const homeRedirect = <Redirect to="/" />
  const appShell = (props) => <App auth={auth} {...props} />
  const forms = (props) => !isAuthed ? homeRedirect : <FormList auth={auth} {...props} />
  const profile = (props) => !isAuthed ? homeRedirect : <Profile auth={auth} {...props} />
  const callback = (props) => <Callback {...props} />

  return (
    <BrowserRouter>
      <div>
        <Route path="/" render={appShell} />
        <Route path="/forms" exact render={forms} />
        <Route path="/forms/:id" component={FormView} />

        <Route path="/profile" render={profile} />
        <Route path="/callback" render={callback} />
      </div>
    </BrowserRouter>
  )
}
