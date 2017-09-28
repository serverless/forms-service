import React from 'react'
import ReactDOM from 'react-dom'
import { makeMainRoutes } from './routes'
import { Provider } from 'react-redux'
import configureStore from './store'
import './index.global.css'

const mount = document.getElementById('root')
const routes = makeMainRoutes()
const store = configureStore()

window.store = store

// Main application wrapped with Redux
const app = (
  <Provider store={store}>
    {routes}
  </Provider>
)

// render app to DOM
ReactDOM.render(app, mount)
