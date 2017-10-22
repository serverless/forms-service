import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from './store'
import App from './app'
import './index.global.css'

const mountNode = document.getElementById('root')
const store = configureStore()

// Main application wrapped with Redux & React Router
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

// render app to DOM
ReactDOM.render(app, mountNode)
