import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import './index.global.css'

const mount = document.getElementById('root')
// const routes = makeMainRoutes()
const store = configureStore()

// Main application wrapped with Redux
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

// render app to DOM
ReactDOM.render(app, mount)
